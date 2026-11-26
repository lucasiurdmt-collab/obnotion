import sys
import os
import re

def extract_pdf(pdf_path):
    try:
        import fitz
    except ImportError:
        return None

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        return None

    # Pass 1: find dominant text color across the document
    color_counts = {}
    for page in doc:
        blocks = page.get_text('dict')['blocks']
        for b in blocks:
            if 'lines' in b:
                for line in b['lines']:
                    for span in line['spans']:
                        txt = span['text'].strip()
                        if txt:
                            c = span['color']
                            color_counts[c] = color_counts.get(c, 0) + len(txt)

    base_color = max(color_counts.items(), key=lambda x: x[1])[0] if color_counts else 0

    full_text = []
    for page in doc:
        # Check highlight annotations (yellow/color markups)
        annot_rects = []
        try:
            for annot in page.annots():
                if annot.type[0] == 8: # Highlight annotation
                    annot_rects.append(annot.rect)
        except Exception:
            pass

        blocks = page.get_text('dict')['blocks']
        page_lines = []
        for b in blocks:
            if 'lines' in b:
                for line in b['lines']:
                    line_spans = []
                    for span in line['spans']:
                        txt = span['text']
                        c = span['color']
                        # Highlight if text has a distinct non-base color (e.g. orange, gold, red, yellow)
                        is_colored = (c != base_color and c != 0 and c != 0xffffff)
                        
                        # Or if inside a highlight annotation
                        is_annot = False
                        if annot_rects:
                            span_bbox = fitz.Rect(span['bbox'])
                            is_annot = any(span_bbox.intersects(r) for r in annot_rects)

                        clean = txt.strip()
                        has_alnum = bool(re.search(r'[A-Za-z0-9À-ÿ]', clean))
                        # Only mark as highlight if it has actual alphanumeric text content (not pure spaces, emojis, or punctuation)
                        if (is_colored or is_annot) and has_alnum and not clean.isdigit():
                            line_spans.append(f'[HL]{txt}[/HL]')
                        else:
                            line_spans.append(txt)
                    page_lines.append(''.join(line_spans))
        full_text.append('\n'.join(page_lines))

    raw_result = '\n\n'.join(full_text)
    clean_result = re.sub(r'\[HL\]\s*\[/HL\]', '', raw_result)
    # Merge consecutive [HL] tags: [HL]foo[/HL] [HL]bar[/HL] -> [HL]foo bar[/HL]
    clean_result = re.sub(r'\[/HL\](\s*)\[HL\]', r'\1', clean_result)
    # Move trailing punctuation outside of [HL] tag: [HL]foo.[/HL] -> [HL]foo[/HL].
    clean_result = re.sub(r'\[HL\](.*?)(\s*[.,;:!?])\[/HL\]', r'[HL]\1[/HL]\2', clean_result)
    return clean_result

if __name__ == '__main__':
    if len(sys.argv) > 1:
        res = extract_pdf(sys.argv[1])
        if res is not None:
            sys.stdout.buffer.write(res.encode('utf-8'))
        else:
            sys.exit(1)
    else:
        sys.exit(1)
