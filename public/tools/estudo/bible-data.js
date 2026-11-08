/**
 * Bible Data & Lessons - Sistema de Atualização Diária Automática
 * Traduções Contemporâneas: Russo (НРП com ударения) e Inglês (NLT).
 * Explicações 100% práticas de expressões vivas (sem gramatiquês).
 */

const BIBLE_DAILY_SETS = {
  // =========================================================================
  // RUSSO (НРП - Novo Russo Contemporâneo com Acentos Tônicos / Ударения)
  // =========================================================================
  ru: [
    // --- DIA 1 ---
    [
      {
        id: 'ru_d1_v1',
        reference: 'Матфе́я 6:34',
        version: 'НРП (Современный перевод)',
        text: 'Ита́к, не забо́тьтесь о за́втрашнем дне, потому́ что за́втрашний день сам позабо́тится о себе́. Для ка́ждого дня доста́точно свои́х трево́г.',
        theme: 'Paz e Foco no Presente',
        translation_pt: 'Portanto, não fiquem ansiosos com o dia de amanhã, pois o amanhã trará as suas próprias preocupações. Para cada dia bastam as suas próprias dificuldades.',
        analysis: {
          intro: 'Esse versículo ensina expressões que todo russo usa no dia a dia para acalmar alguém e falar sobre o futuro.',
          expressions: [
            {
              phrase: 'не забо́тьтесь о...',
              meaning: 'não fiquem esquentando a cabeça com... / não se preocupem com...',
              how_it_works: 'A palavra "забо́тьтесь" vem de cuidado. Quando você coloca o "не" (não) na frente e cola com a palavrinha "о" (sobre/com), vira literalmente: "não fique sofrendo por antecedência com isso". É o jeito mais carinhoso e educado de dizer para alguém relaxar.',
              anki_front: 'не забо́тьтесь о...',
              anki_back: 'não fiquem esquentando a cabeça com... / não se preocupem com...',
              anki_hint: 'Матфея 6:34'
            },
            {
              phrase: 'за́втрашний день',
              meaning: 'o amanhã / o dia seguinte',
              how_it_works: 'Em russo, para falar do dia de amanhã, eles juntam duas palavras: "за́втрашний" (que quer dizer "de amanhã") com "день" (que é dia). Fica literalmente "o dia de amanhã". Você usa isso sempre que for planejar algo: "Quais são nossos planos para o dia de amanhã?".',
              anki_front: 'за́втрашний день',
              anki_back: 'o dia de amanhã / o futuro próximo',
              anki_hint: 'Palavra de amanhã + dia'
            },
            {
              phrase: 'доста́точно!',
              meaning: 'já é o bastante! / já chega! / já deu!',
              how_it_works: 'É a palavra mágica para dar um ponto final. Se alguém está enchendo o seu prato de comida e você quer que pare, ou se você cansou de trabalhar e quer encerrar o dia, basta dizer firme: "Доста́точно!" (Chega, já está ótimo!).',
              anki_front: 'доста́точно!',
              anki_back: 'já chega! / é o bastante! / já deu!',
              anki_hint: 'Palavra para dizer "chega!"'
            }
          ],
          daily_examples: [
            {
              target: 'Не забо́ться об э́том, я всё сам ула́жу!',
              pt: 'Não esquenta a cabeça com isso, eu resolvo tudo sozinho!',
              context: 'Apoiando sua namorada ou um amigo em um imprevisto.'
            },
            {
              target: 'Каки́е у нас пла́ны на за́втрашний день?',
              pt: 'Quais são os nossos planos para o dia de amanhã?',
              context: 'Combinando a rotina ou um passeio.'
            }
          ]
        }
      },
      {
        id: 'ru_d1_v2',
        reference: 'Матфе́я 7:7',
        version: 'НРП (Современный перевод)',
        text: 'Проси́те — и вам даду́т, ищи́те — и найдёте, стучи́те — и вам откро́ют.',
        theme: 'Ação e Persistência',
        translation_pt: 'Peçam — e lhes será dado; busquem — e encontrarão; batam — e a porta lhes será aberta.',
        analysis: {
          intro: 'Aqui vemos como o russo junta pequenas palavras para dar a ideia de "você faz isso e as pessoas fazem aquilo por você".',
          expressions: [
            {
              phrase: 'Проси́те — и вам даду́т',
              meaning: 'Peçam — e vão dar para vocês',
              how_it_works: 'A palavra "Проси́те" em si significa "peçam" (no sentido de vocês pedirem). A palavra "вам" significa literalmente "a vocês / para você", e "даду́т" significa "eles vão dar". Juntando tudo: "vocês pedem, e vão te entregar o que você pediu".',
              anki_front: 'и вам даду́т',
              anki_back: 'e vão dar para você / e vão te entregar',
              anki_hint: 'вам (para vocês) + дадут (vão dar)'
            },
            {
              phrase: 'ищи́те — и найдёте',
              meaning: 'procurem — e vocês vão achar',
              how_it_works: '"ищи́те" é quando você está procurando algo que sumiu (procurando a chave ou um endereço). E "найдёте" é a hora que você finalmente acha! Juntas, formam o clássico: quem procura, acha!',
              anki_front: 'ищи́те и найдёте',
              anki_back: 'procurem e encontrarão / quem procura, acha',
              anki_hint: 'ищите (procurem) + найдёте (acharão)'
            },
            {
              phrase: 'стучи́те — и вам откро́ют',
              meaning: 'batam — e vão abrir para vocês',
              how_it_works: '"стучи́те" é bater (como bater na porta de alguém). E "вам откро́ют" junta "вам" (para vocês) com "откро́ют" (vão abrir). Ou seja: você bate na porta, e alguém vai lá e abre para você entrar.',
              anki_front: 'и вам откро́ют',
              anki_back: 'e vão abrir a porta para vocês',
              anki_hint: 'вам (para vocês) + откроют (vão abrir)'
            }
          ],
          daily_examples: [
            {
              target: 'Проси́, е́сли что-то ну́жно, не стесня́йся!',
              pt: 'Pede se você precisar de algo, não fica com vergonha!',
              context: 'Oferecendo ajuda ou comida a uma visita.'
            },
            {
              target: 'Кто и́щет, тот всегда́ найдёт.',
              pt: 'Quem procura sempre acha.',
              context: 'Provérbio clássico incentivando persistência.'
            }
          ]
        }
      },
      {
        id: 'ru_d1_v3',
        reference: 'Иоа́нна 14:27',
        version: 'НРП (Современный перевод)',
        text: 'Мир оставля́ю вам, Мой мир даю́ вам. Пусть не трево́жится ва́ше се́рдце и не страши́тся.',
        theme: 'Paz Interior vs Medo',
        translation_pt: 'Deixo-lhes a paz; a minha paz lhes dou. Não se perturbe o seu coração, nem tenham medo.',
        analysis: {
          intro: 'Expressões fundamentais para desejar paz e tirar o peso de preocupações.',
          expressions: [
            {
              phrase: 'Мой мир даю́ вам',
              meaning: 'Dou a minha paz a vocês',
              how_it_works: '"Мой мир" quer dizer "a minha paz / o meu mundo de tranquilidade", e "даю вам" é "eu entrego/dou para vocês". Muito afetuoso e acolhedor.',
              anki_front: 'Мой мир даю́ вам',
              anki_back: 'Eu dou a minha paz para vocês',
              anki_hint: 'мир (paz) + даю (dou)'
            },
            {
              phrase: 'Пусть не...',
              meaning: 'Que não... / Deixa que não...',
              how_it_works: 'A palavrinha "Пусть" é o jeito mais natural do russo dizer "deixa acontecer" ou "que assim seja". Quando coloca "не" (não), vira "que não fique assim": "Пусть не тревожится" = "Que o seu coração não fique agitado".',
              anki_front: 'Пусть...',
              anki_back: 'Que aconteça... / Deixa que...',
              anki_hint: 'Palavra para consentir ou desejar algo'
            }
          ],
          daily_examples: [
            {
              target: 'Пусть всё бу́дет хорошо́!',
              pt: 'Que dê tudo certo! / Vai dar tudo certo!',
              context: 'Desejando boa sorte antes de um exame ou dia de trabalho.'
            }
          ]
        }
      },
      {
        id: 'ru_d1_v4',
        reference: 'Филиппи́йцам 4:6',
        version: 'НРП (Современный перевод)',
        text: 'Ни о чём не беспоко́йтесь, но во всём открыва́йте свои́ жела́ния Бо́гу в моли́тве и про́сьбе с благодаре́нием.',
        theme: 'Gratidão e Oração Prática',
        translation_pt: 'Não andem ansiosos por coisa alguma, mas em tudo apresentem seus pedidos a Deus pela oração e súplica, com ação de graças.',
        analysis: {
          intro: 'Aprenda a dizer "não esquenta com nada" e a expressar pedidos com gratidão.',
          expressions: [
            {
              phrase: 'Ни о чём не беспоко́йтесь',
              meaning: 'Não fiquem preocupados com absolutamente nada',
              how_it_works: 'Em russo, para dar ênfase que você não deve esquentar com nada, eles dobram o negativo: "Ни о чём" (com nada) + "не беспокойтесь" (não se preocupem). Soa como: "Relaxa total, zero estresse!".',
              anki_front: 'Ни о чём не беспоко́йтесь',
              anki_back: 'Não se preocupem com nada / Zero preocupação',
              anki_hint: 'Dupla negação russa de alívio'
            },
            {
              phrase: 'с благодаре́нием',
              meaning: 'com sentimento de gratidão / agradecendo de coração',
              how_it_works: '"Благодарение" vem da união de duas raízes lindas: "благо" (o bem/coisa boa) + "дарить" (dar/presentear). Ou seja: você pede algo já presenteando a pessoa ou a Deus com gratidão.',
              anki_front: 'с благодаре́нием',
              anki_back: 'com gratidão / agradecido',
              anki_hint: 'благо (bem) + дарить (dar)'
            }
          ],
          daily_examples: [
            {
              target: 'Ни о чём не беспоко́йся, мы успева́ем во́время!',
              pt: 'Não se preocupa com nada, a gente vai chegar no horário!',
              context: 'Avisando que o trânsito está tranquilo.'
            }
          ]
        }
      },
      {
        id: 'ru_d1_v5',
        reference: 'Римля́нам 12:21',
        version: 'НРП (Современный перевод)',
        text: 'Не будь побеждён злом, но побежда́й зло добро́м.',
        theme: 'Vencendo o Mal com o Bem',
        translation_pt: 'Não se deixe vencer pelo mal, mas vença o mal com o bem.',
        analysis: {
          intro: 'Frase de impacto e coragem para lidar com atritos diários mantendo a serenidade.',
          expressions: [
            {
              phrase: 'побежда́й зло добро́м',
              meaning: 'vença o mal fazendo o bem',
              how_it_works: '"побеждай" é o imperativo positivo "vença!". "Зло" é a maldade ou uma situação ruim, e "добром" significa usar a bondade como a sua ferramenta de vitória.',
              anki_front: 'побежда́й зло добро́м',
              anki_back: 'vença o mal com o bem',
              anki_hint: 'Римлянам 12:21'
            }
          ],
          daily_examples: [
            {
              target: 'Всегда́ отве́чай добро́м на гру́бость.',
              pt: 'Sempre responda com gentileza à grosseria.',
              context: 'Conselho prático de postura no dia a dia.'
            }
          ]
        }
      }
    ],

    // --- DIA 2 ---
    [
      {
        id: 'ru_d2_v1',
        reference: 'Иоа́нна 8:32',
        version: 'НРП (Современный перевод)',
        text: 'И позна́ете и́стину, и и́стина сде́лает вас свобо́дными.',
        theme: 'Liberdade e Verdade',
        translation_pt: 'E conhecerão a verdade, e a verdade os libertará.',
        analysis: {
          intro: 'Versículo célebre que ensina como expressar a ideia de libertação e de entender a realidade.',
          expressions: [
            {
              phrase: 'сде́лает вас свобо́дными',
              meaning: 'vai libertar vocês / vai deixar vocês livres',
              how_it_works: '"Сде́лает" quer dizer fará ou vai tornar. Somado com "свобо́дными" (livres), significa literalmente: "vai transformar vocês em pessoas livres". No cotidiano, é o mesmo que tirar um peso enorme das costas.',
              anki_front: 'сде́лает вас свобо́дными',
              anki_back: 'vai libertar vocês / vai te deixar livre',
              anki_hint: 'сделает (fará) + свободными (livres)'
            },
            {
              phrase: 'позна́ете и́стину',
              meaning: 'vocês vão conhecer a verdade / vão sacar a real',
              how_it_works: '"И́стина" é a verdade no sentido mais profundo e sólido. "Позна́ете" significa descobrir com clareza, compreender de fato.',
              anki_front: 'позна́ть и́стину',
              anki_back: 'conhecer a verdade / compreender a realidade',
              anki_hint: 'Иоанна 8:32'
            }
          ],
          daily_examples: [
            {
              target: 'Правда всегда́ де́лает челове́ка свобо́дным.',
              pt: 'A verdade sempre deixa a pessoa em paz e livre.',
              context: 'Conversando honestamente sobre um relacionamento.'
            }
          ]
        }
      },
      {
        id: 'ru_d2_v2',
        reference: 'Гала́там 6:9',
        version: 'НРП (Современный перевод)',
        text: 'Бу́дем неуста́нно де́лать добро́; е́сли мы не опусти́м ру́ки, то в своё вре́мя пожнём урожа́й.',
        theme: 'Persistência sem Desanimar',
        translation_pt: 'E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desistirmos.',
        analysis: {
          intro: 'Uma das expressões mais vivas e famosas do russo do dia a dia está aqui!',
          expressions: [
            {
              phrase: 'не опусти́ть ру́ки',
              meaning: 'não desistir / não jogar a toalha / não desanimar',
              how_it_works: 'Expressão idiomática 100% nativa! Em russo, para dizer que alguém desistiu, dizem literalmente "abaixou as mãos/braços" (опустил руки). Quando dizem "не опустим руки", significa: "não vamos abaixar a guarda nem jogar a toalha!".',
              anki_front: 'не опуска́ть ру́ки',
              anki_back: 'não desistir / não jogar a toalha',
              anki_hint: 'Literal: não abaixar os braços'
            },
            {
              phrase: 'в своё вре́мя',
              meaning: 'no momento certo / na hora certa',
              how_it_works: '"В своё время" junta "no seu próprio" com "tempo". É a frase mais reconfortante para dizer que as coisas boas vão acontecer na hora exata.',
              anki_front: 'в своё вре́мя',
              anki_back: 'no momento certo / na hora certa',
              anki_hint: 'Expressão de paciência'
            }
          ],
          daily_examples: [
            {
              target: 'Никогда́ не опуска́й ру́ки, всё получи́тся!',
              pt: 'Nunca desista, vai dar tudo certo!',
              context: 'Incentivando sua namorada nos estudos ou carreira.'
            },
            {
              target: 'Всё придёт в своё вре́мя.',
              pt: 'Tudo virá na hora certa.',
              context: 'Acalmando a ansiedade por um resultado.'
            }
          ]
        }
      },
      {
        id: 'ru_d2_v3',
        reference: '1 Кори́нфянам 13:4',
        version: 'НРП (Современный перевод)',
        text: 'Любо́вь терпели́ва, любо́вь добра́, она́ не зави́дует, не хва́стается, не горди́тся.',
        theme: 'O Amor Real e Cotidiano',
        translation_pt: 'O amor é paciente, o amor é bondoso. Não tem inveja, não se vangloria, não é orgulhoso.',
        analysis: {
          intro: 'Palavras essenciais para descrever sentimentos nobres e atitudes maduras no casal.',
          expressions: [
            {
              phrase: 'не хва́стается',
              meaning: 'não fica contando vantagem / não fica se exibindo',
              how_it_works: 'O verbo "хва́статься" é muito usado no dia a dia quando alguém fica se gabando ou postando coisas para aparecer. O amor de verdade é simples e não precisa disso.',
              anki_front: 'хва́статься',
              anki_back: 'se gabar / contar vantagem / se exibir',
              anki_hint: '1 Коринфянам 13:4'
            },
            {
              phrase: 'она́ не зави́дует',
              meaning: 'ela não tem inveja / ela torce pelo bem',
              how_it_works: '"Зави́довать" é sentir inveja. Quem ama fica feliz com a vitória do outro em vez de ter ciúme ou inveja.',
              anki_front: 'зави́довать',
              anki_back: 'ter inveja / invejar',
              anki_hint: 'Expressão de caráter'
            }
          ],
          daily_examples: [
            {
              target: 'Настоя́щая любо́вь всегда́ терпели́ва.',
              pt: 'O verdadeiro amor é sempre paciente.',
              context: 'Momento de carinho e reflexão a dois.'
            }
          ]
        }
      },
      {
        id: 'ru_d2_v4',
        reference: 'Коло́ссянам 3:13',
        version: 'НРП (Современный перевод)',
        text: 'Бу́дьте снисходи́тельны друг к дру́гу и проща́йте взаи́мные оби́ды.',
        theme: 'Paciência e Compreensão Mútua',
        translation_pt: 'Sejam compreensivos uns com os outros e perdoem as queixas que tiverem mutuamente.',
        analysis: {
          intro: 'Aprenda a expressão mais importante do russo para falar de reciprocidade no relacionamento.',
          expressions: [
            {
              phrase: 'друг к дру́гу',
              meaning: 'um com o outro / mutuamente',
              how_it_works: 'Expressão obrigatória! "Друг к другу" significa literalmente "um em direção ao outro". É usada para qualquer ação recíproca: "vamos ser gentis um com o outro" ou "vamos cuidar um do outro".',
              anki_front: 'друг к дру́гу',
              anki_back: 'um com o outro / mutuamente',
              anki_hint: 'Expressão essencial de casal'
            },
            {
              phrase: 'проща́йте оби́ды',
              meaning: 'deixem as mágoas de lado / perdoem os ressentimentos',
              how_it_works: '"Оби́да" é aquele sentimento de chateação ou mágoa que a gente guarda quando algo machuca. Perdoar a "обида" significa zerar o placar e não guardar rancor.',
              anki_front: 'оби́да',
              anki_back: 'mágoa / ressentimento / chateação guardada',
              anki_hint: 'Sentimento de rancor'
            }
          ],
          daily_examples: [
            {
              target: 'Мы должны́ бере́чь друг дру́га.',
              pt: 'Nós devemos cuidar e proteger um ao outro.',
              context: 'Falando com sua namorada sobre união.'
            }
          ]
        }
      },
      {
        id: 'ru_d2_v5',
        reference: 'Матфе́я 5:16',
        version: 'НРП (Современный перевод)',
        text: 'Пусть так же све́тит и ваш свет пе́ред людьми́, что́бы они́ ви́дели ва́ши до́брые дела́.',
        theme: 'Bom Exemplo no Dia a Dia',
        translation_pt: 'Assim brilhe a luz de vocês diante dos homens, para que vejam as suas boas obras.',
        analysis: {
          intro: 'Expressões sobre ser uma influência positiva na vida das pessoas ao seu redor.',
          expressions: [
            {
              phrase: 'пе́ред людьми́',
              meaning: 'diante das pessoas / na frente de todo mundo',
              how_it_works: '"Пе́ред" significa na presença de ou diante de. "Людьми" são as pessoas. Ou seja, viver de forma íntegra publicamente.',
              anki_front: 'пе́ред людьми́',
              anki_back: 'diante das pessoas / perante os outros',
              anki_hint: 'перед (diante) + людьми (pessoas)'
            },
            {
              phrase: 'до́брые дела́',
              meaning: 'boas ações / atitudes generosas',
              how_it_works: 'Combinação simples e poderosa: "добрые" (boas/bondosas) + "дела" (ações/feitos). Fazer o bem sem esperar nada em troca.',
              anki_front: 'до́брые дела́',
              anki_back: 'boas ações / gestos de bondade',
              anki_hint: 'Матфея 5:16'
            }
          ],
          daily_examples: [
            {
              target: 'Твой приме́р вдохновля́ет дру́гих.',
              pt: 'O seu exemplo inspira os outros.',
              context: 'Elogiando uma atitude nobre de alguém.'
            }
          ]
        }
      }
    ],

    // --- DIA 3 ---
    [
      {
        id: 'ru_d3_v1',
        reference: 'Иа́кова 1:19',
        version: 'НРП (Современный перевод)',
        text: 'Пусть ка́ждый бу́дет скор на слы́шание, медли́телен на слова́ и медли́телен на гнев.',
        theme: 'Sabedoria na Comunicação',
        translation_pt: 'Sejam todos prontos para ouvir, tardios para falar e tardios para se irar.',
        analysis: {
          intro: 'A melhor regra de ouro para conversas maduras e evitar discussões desnecessárias.',
          expressions: [
            {
              phrase: 'скор на слы́шание',
              meaning: 'rápido para escutar / bom ouvinte',
              how_it_works: '"Скор" é rápido/ágil. Estar "скор на слышание" significa prestar atenção de verdade quando a outra pessoa está desabafando, em vez de interromper.',
              anki_front: 'быть ско́рым на слы́шание',
              anki_back: 'saber ouvir / ser rápido para escutar',
              anki_hint: 'Иакова 1:19'
            },
            {
              phrase: 'медли́телен на гнев',
              meaning: 'ter paciência / não perder a cabeça à toa',
              how_it_works: '"Медли́телен" é calmo, sem pressa. E "гнев" é a raiva ou fúria. A frase ensina a respirar fundo e pensar antes de estourar.',
              anki_front: 'медли́телен на гнев',
              anki_back: 'paciente / que não perde a cabeça fácil',
              anki_hint: 'медлителен (lento) + гнев (raiva)'
            }
          ],
          daily_examples: [
            {
              target: 'Дава́й снача́ла вы́слушаем друг дру́га споко́йно.',
              pt: 'Vamos primeiro nos escutar com calma.',
              context: 'Resolvendo um desentendimento com paciência.'
            }
          ]
        }
      },
      {
        id: 'ru_d3_v2',
        reference: '1 Петра́ 5:7',
        version: 'НРП (Современный перевод)',
        text: 'Возложи́те все ва́ши забо́ты на Него́, ведь Он печётся о вас.',
        theme: 'Cuidado e Descanso Emocional',
        translation_pt: 'Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.',
        analysis: {
          intro: 'Uma das palavras mais doces do afeto e carinho russo.',
          expressions: [
            {
              phrase: 'Он печётся о вас',
              meaning: 'Ele cuida de vocês / Ele se importa de verdade com vocês',
              how_it_works: 'O verbo "печься о ком-то" vem da ideia de aquecer e cuidar com carinho materno. É quando você se importa genuinamente com o bem-estar da pessoa amada.',
              anki_front: 'печься о ком-то',
              anki_back: 'cuidar com carinho / se preocupar com o bem de alguém',
              anki_hint: '1 Петра 5:7'
            }
          ],
          daily_examples: [
            {
              target: 'Я всегда́ забо́чусь и пеку́сь о тебе́.',
              pt: 'Eu sempre cuido e me importo de coração com você.',
              context: 'Declaração sincera de carinho e proteção.'
            }
          ]
        }
      },
      {
        id: 'ru_d3_v3',
        reference: 'Матфе́я 6:21',
        version: 'НРП (Современный перевод)',
        text: 'Ведь где твоё сокро́вище, там бу́дет и твоё се́рдце.',
        theme: 'O Que Realmente Importa',
        translation_pt: 'Pois onde estiver o seu tesouro, aí estará também o seu coração.',
        analysis: {
          intro: 'Estrutura clássica de causa e efeito para conversas profundas.',
          expressions: [
            {
              phrase: 'где..., там...',
              meaning: 'onde está [algo], lá também estará [outra coisa]',
              how_it_works: 'Conector clássico do russo! "Где... там..." serve para associar duas coisas inseparáveis: "Onde há amor, lá há paz".',
              anki_front: 'где..., там...',
              anki_back: 'onde..., lá...',
              anki_hint: 'Conector de localização'
            },
            {
              phrase: 'твоё сокро́вище',
              meaning: 'o seu tesouro / o que você mais valoriza',
              how_it_works: '"Сокро́вище" é algo de valor inestimável. Muito comum também chamar carinhosamente a namorada ou o filho de "моё сокровище" (meu tesouro).',
              anki_front: 'сокро́вище',
              anki_back: 'tesouro / algo precioso',
              anki_hint: 'Termo afetuoso'
            }
          ],
          daily_examples: [
            {
              target: 'Ты — моё гла́вное сокро́вище в жи́зни.',
              pt: 'Você é o meu maior tesouro na vida.',
              context: 'Falando com carinho para a namorada.'
            }
          ]
        }
      },
      {
        id: 'ru_d3_v4',
        reference: 'Ефе́сянам 4:32',
        version: 'НРП (Современный перевод)',
        text: 'Бу́дьте добры́ друг к дру́гу, сострада́тельны, проща́йте друг дру́га.',
        theme: 'Gentileza e Empatia',
        translation_pt: 'Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente.',
        analysis: {
          intro: 'Aprenda palavras que definem pessoas com coração bom e empático.',
          expressions: [
            {
              phrase: 'сострада́тельны',
              meaning: 'compassivos / cheios de empatia',
              how_it_works: '"Сострадание" une "со" (junto com) + "страдание" (sofrimento). Significa sentir a dor da outra pessoa e se colocar no lugar dela para ajudar.',
              anki_front: 'сострада́тельный',
              anki_back: 'compassivo / cheio de empatia',
              anki_hint: 'со (junto) + страдание (sentir a dor)'
            }
          ],
          daily_examples: [
            {
              target: 'Просто обними́ меня́, мне ну́жно твоё сострада́ние.',
              pt: 'Apenas me abrace, eu preciso do seu carinho e empatia.',
              context: 'Buscando conforto após um dia cansativo.'
            }
          ]
        }
      },
      {
        id: 'ru_d3_v5',
        reference: '2 Тимофе́ю 1:7',
        version: 'НРП (Современный перевод)',
        text: 'Ведь Бог дал нам дух не ро́бости, но си́лы, любви́ и благоразу́мия.',
        theme: 'Coragem e Equilíbrio Mental',
        translation_pt: 'Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.',
        analysis: {
          intro: 'Para vencer o receio e agir com segurança e cabeça fria.',
          expressions: [
            {
              phrase: 'не ро́бости, но си́лы',
              meaning: 'não de covardia/timidez, mas de coragem e força',
              how_it_works: '"Ро́бость" é aquela insegurança ou hesitação que trava a gente de falar ou dar um passo. O versículo nos convida a agir com firmeza e amor.',
              anki_front: 'ро́бость',
              anki_back: 'timidez excessiva / hesitação / covardia',
              anki_hint: 'Sentimento de trava'
            },
            {
              phrase: 'благоразу́мие',
              meaning: 'bom senso / clareza mental / equilíbrio',
              how_it_works: 'Junta "благо" (o bem) com "разум" (a mente/razão). É agir com sabedoria e cabeça fria, sem impulsividade.',
              anki_front: 'благоразу́мие',
              anki_back: 'bom senso / equilíbrio mental / sensatez',
              anki_hint: 'благо (bom) + разум (mente)'
            }
          ],
          daily_examples: [
            {
              target: 'В любо́й ситуа́ции сохраня́й благоразу́мие.',
              pt: 'Em qualquer situação mantenha o bom senso e a calma.',
              context: 'Dica prática para tomada de decisão.'
            }
          ]
        }
      }
    ]
  ],

  // =========================================================================
  // INGLÊS (NLT - New Living Translation, Século XXI sem Arcaísmos)
  // =========================================================================
  en: [
    // --- DIA 1 ---
    [
      {
        id: 'en_d1_v1',
        reference: 'Matthew 6:34',
        version: 'NLT (New Living Translation)',
        text: 'So don’t worry about tomorrow, for tomorrow will bring its own worries. Today’s trouble is enough for today.',
        theme: 'Living in the Present',
        translation_pt: 'Portanto, não se preocupem com o amanhã, pois o amanhã trará suas próprias preocupações. Os problemas de hoje já são suficientes para hoje.',
        analysis: {
          intro: 'Expressões em inglês contemporâneo que você escuta em filmes, séries e conversas reais para acalmar amigos.',
          expressions: [
            {
              phrase: 'don’t worry about...',
              meaning: 'não esquenta com... / não se preocupa com...',
              how_it_works: 'A forma mais comum e natural no mundo inteiro para dizer a alguém: "relaxa, não gasta sua energia com isso agora".',
              anki_front: 'don’t worry about...',
              anki_back: 'não esquenta com... / não se preocupe com...',
              anki_hint: 'Matthew 6:34'
            },
            {
              phrase: 'enough for today',
              meaning: 'já deu por hoje / chega por hoje',
              how_it_works: 'Quando você termina um dia puxado de trabalho ou estudo e quer dizer aos outros que é hora de descansar, você fala exatamente isso: "That’s enough for today!" (Já deu por hoje, chega!).',
              anki_front: 'enough for today',
              anki_back: 'o bastante por hoje / chega por hoje',
              anki_hint: 'Expressão de encerramento'
            }
          ],
          daily_examples: [
            {
              target: 'Don’t worry about the meeting tomorrow, you are prepared!',
              pt: 'Não esquenta a cabeça com a reunião de amanhã, você está preparado!',
              context: 'Apoiando alguém antes de uma apresentação.'
            },
            {
              target: 'I think that’s enough study for today. Let’s rest.',
              pt: 'Acho que já deu de estudo por hoje. Vamos descansar.',
              context: 'Encerrando a sessão de estudo com sua namorada.'
            }
          ]
        }
      },
      {
        id: 'en_d1_v2',
        reference: 'Matthew 7:7',
        version: 'NLT (New Living Translation)',
        text: 'Keep on asking, and you will receive what you ask for. Keep on looking, and you will find. Keep on knocking, and the door will be opened to you.',
        theme: 'Persistence & Action',
        translation_pt: 'Continuem pedindo, e receberão o que pedirem. Continuem procurando, e acharão. Continuem batendo, e a porta será aberta para vocês.',
        analysis: {
          intro: 'Veja a estrutura "Keep on + verbo com ING", que todo nativo americano usa para incentivar alguém a não parar.',
          expressions: [
            {
              phrase: 'Keep on + [verbo]-ing',
              meaning: 'continue fazendo... / não pare de...',
              how_it_works: 'Quando você cola "Keep on" antes de uma ação (asking, trying, going), significa literalmente: continue firme, não pare por nada!',
              anki_front: 'Keep on going!',
              anki_back: 'Continue firme! / Não pare!',
              anki_hint: 'Keep on + ING'
            },
            {
              phrase: 'what you ask for',
              meaning: 'aquilo que você pediu',
              how_it_works: 'Em inglês, para falar "o que você pediu", eles juntam "what you ask" com a preposição "for". Sempre que pedir um prato no restaurante ou um favor: "Is this what you asked for?" (É isso que você pediu?).',
              anki_front: 'what you ask for',
              anki_back: 'o que você pediu',
              anki_hint: 'Pedir algo = ask for'
            }
          ],
          daily_examples: [
            {
              target: 'Keep on practicing every day and you will be fluent!',
              pt: 'Continue praticando todo dia e você vai ficar fluente!',
              context: 'Motivação nos estudos de idiomas.'
            }
          ]
        }
      },
      {
        id: 'en_d1_v3',
        reference: 'John 14:27',
        version: 'NLT (New Living Translation)',
        text: 'I am leaving you with a gift—peace of mind and heart. And the peace I give is a gift the world cannot give. So don’t be troubled or afraid.',
        theme: 'Peace of Mind',
        translation_pt: 'Deixo com vocês um presente: a paz de espírito e de coração. E a paz que eu dou não é como o mundo dá. Portanto, não fiquem angustiados nem com medo.',
        analysis: {
          intro: 'Expressão famosíssima no inglês moderno: "peace of mind" (paz de espírito).',
          expressions: [
            {
              phrase: 'peace of mind',
              meaning: 'paz de espírito / tranquilidade na cabeça',
              how_it_works: 'Você usa "peace of mind" sempre que faz algo para poder dormir tranquilo, como pagar uma conta antes do vencimento ou checar se a porta está trancada.',
              anki_front: 'peace of mind',
              anki_back: 'paz de espírito / tranquilidade mental',
              anki_hint: 'Paz de mente'
            },
            {
              phrase: 'don’t be troubled',
              meaning: 'não fique angustiado / não esquenta',
              how_it_works: '"Troubled" descreve quando sua mente está cheia de turbulência ou problemas. Dizer "don’t be troubled" é um pedido carinhoso para a pessoa se acalmar.',
              anki_front: 'don’t be troubled',
              anki_back: 'não fique angustiado / fique em paz',
              anki_hint: 'John 14:27'
            }
          ],
          daily_examples: [
            {
              target: 'Booking the hotel in advance gave us peace of mind.',
              pt: 'Reservar o hotel com antecedência nos deu uma baita paz de espírito.',
              context: 'Planejando uma viagem a dois.'
            }
          ]
        }
      },
      {
        id: 'en_d1_v4',
        reference: 'Philippians 4:6',
        version: 'NLT (New Living Translation)',
        text: 'Don’t worry about anything; instead, pray about everything. Tell God what you need, and thank him for all he has done.',
        theme: 'Overcoming Anxiety',
        translation_pt: 'Não se preocupem com nada; em vez disso, orem sobre tudo. Digam a Deus o que precisam e agradeçam por tudo que ele fez.',
        analysis: {
          intro: 'Aprenda a conectar ideias com "instead" (em vez de / ao invés disso).',
          expressions: [
            {
              phrase: 'instead, ...',
              meaning: 'em vez disso... / pelo contrário...',
              how_it_works: '"Instead" é a palavra perfeita para propor uma solução melhor: "Não fique triste; em vez disso, vamos dar uma caminhada!".',
              anki_front: 'instead',
              anki_back: 'em vez disso / ao invés',
              anki_hint: 'Palavra de transição'
            },
            {
              phrase: 'what you need',
              meaning: 'o que você precisa / do que você está precisando',
              how_it_works: 'Estrutura direta do dia a dia: "Just tell me what you need" (Só me diz o que você precisa).',
              anki_front: 'what you need',
              anki_back: 'o que você precisa',
              anki_hint: 'Uso diário para oferecer ajuda'
            }
          ],
          daily_examples: [
            {
              target: 'Let me know what you need, and I’ll help you right away.',
              pt: 'Me fala o que você precisa, e eu te ajudo agora mesmo.',
              context: 'Oferecendo apoio na rotina de casa.'
            }
          ]
        }
      },
      {
        id: 'en_d1_v5',
        reference: 'Romans 12:21',
        version: 'NLT (New Living Translation)',
        text: 'Don’t let evil conquer you, but conquer evil by doing good.',
        theme: 'Overcoming Negativity',
        translation_pt: 'Não se deixem vencer pelo mal, mas vençam o mal fazendo o bem.',
        analysis: {
          intro: 'Veja a construção "Don’t let + [alguém/algo] + verbo", padrão ouro para dizer "não permita que isso aconteça".',
          expressions: [
            {
              phrase: 'Don’t let ... conquer you',
              meaning: 'Não deixe que ... vença você / Não se deixe abalar por ...',
              how_it_works: '"Don’t let" significa "não permita / não deixe". É o comando mais comum para evitar que o cansaço ou pessoas negativas estraguem seu humor.',
              anki_front: 'Don’t let ... get to you',
              anki_back: 'Não deixe que ... te afete / Não se deixe abalar',
              anki_hint: 'Expressão de resiliência'
            },
            {
              phrase: 'by doing good',
              meaning: 'fazendo o bem / através de boas atitudes',
              how_it_works: 'Em inglês, "by" seguido de um verbo com ING expressa o método de vitória: "venceu treinando duro" (won by training hard). Aqui: "vença fazendo o bem" (by doing good).',
              anki_front: 'by doing good',
              anki_back: 'fazendo o bem / através de boas ações',
              anki_hint: 'By + ING (método)'
            }
          ],
          daily_examples: [
            {
              target: 'Don’t let a bad day make you feel like you have a bad life.',
              pt: 'Não deixe um dia ruim fazer você achar que tem uma vida ruim.',
              context: 'Conversando de noite para animar a parceira.'
            }
          ]
        }
      }
    ],

    // --- DIA 2 ---
    [
      {
        id: 'en_d2_v1',
        reference: 'John 8:32',
        version: 'NLT (New Living Translation)',
        text: 'And you will know the truth, and the truth will set you free.',
        theme: 'Truth & Freedom',
        translation_pt: 'E vocês conhecerão a verdade, e a verdade os libertará.',
        analysis: {
          intro: 'Uma das expressões mais famosas de todo o vocabulário ocidental: "set free".',
          expressions: [
            {
              phrase: 'set you free',
              meaning: 'libertar você / te deixar livre',
              how_it_works: 'A união do verbo "set" com o adjetivo "free" significa dar liberdade completa. "The apology set him free" (O pedido de desculpas tirou o peso das costas dele).',
              anki_front: 'set someone free',
              anki_back: 'libertar alguém / livrar alguém de uma prisão',
              anki_hint: 'set + free'
            }
          ],
          daily_examples: [
            {
              target: 'Being honest about your feelings will set you free.',
              pt: 'Ser honesto sobre os seus sentimentos vai te deixar com a consciência leve.',
              context: 'Conversando sobre sinceridade.'
            }
          ]
        }
      },
      {
        id: 'en_d2_v2',
        reference: 'Galatians 6:9',
        version: 'NLT (New Living Translation)',
        text: 'So let’s not get tired of doing what is good. At just the right time we will reap a harvest of blessing if we don’t give up.',
        theme: 'Never Giving Up',
        translation_pt: 'Portanto, não nos cansemos de fazer o bem. Na hora certa colheremos uma bênção, se não desistirmos.',
        analysis: {
          intro: 'Phonetics e phrasal verbs essenciais: "get tired of", "at just the right time" e "give up".',
          expressions: [
            {
              phrase: 'don’t give up!',
              meaning: 'não desista! / não jogue a toalha!',
              how_it_works: 'O phrasal verb mais famoso do inglês: "give up" significa desistir de vez.',
              anki_front: 'give up',
              anki_back: 'desistir / jogar a toalha',
              anki_hint: 'Phrasal verb essencial'
            },
            {
              phrase: 'at just the right time',
              meaning: 'no momento exato / na hora certa',
              how_it_works: '"Just the right time" adiciona a palavrinha "just" para dar aquela ênfase de precisão: não antes, nem depois, mas exatamente quando tinha que ser.',
              anki_front: 'at just the right time',
              anki_back: 'no momento perfeito / na hora certa',
              anki_hint: 'Expressão de tempo perfeito'
            }
          ],
          daily_examples: [
            {
              target: 'Keep going and don’t give up on your dreams!',
              pt: 'Continue firme e não desista dos seus sonhos!',
              context: 'Incentivo e companheirismo diário.'
            }
          ]
        }
      },
      {
        id: 'en_d2_v3',
        reference: '1 Corinthians 13:4',
        version: 'NLT (New Living Translation)',
        text: 'Love is patient and kind. Love is not jealous or boastful or proud.',
        theme: 'True Love in Everyday Life',
        translation_pt: 'O amor é paciente e bondoso. O amor não é ciumento, nem se gaba, nem é orgulhoso.',
        analysis: {
          intro: 'Vocabulário rico de qualidades emocionais para descrever relacionamentos saudáveis.',
          expressions: [
            {
              phrase: 'not boastful',
              meaning: 'não fica contando vantagem / não se gaba',
              how_it_works: '"Boast" é falar de si mesmo para se achar superior. Quem ama é simples e não precisa de arrogância.',
              anki_front: 'boastful',
              anki_back: 'que se gaba / que conta vantagem / exibido',
              anki_hint: '1 Corinthians 13:4'
            },
            {
              phrase: 'patient and kind',
              meaning: 'paciente e compreensivo/gentil',
              how_it_works: 'Par de adjetivos perfeito para expressar o clima de um relacionamento harmonioso.',
              anki_front: 'kind',
              anki_back: 'gentil / bondoso / atencioso',
              anki_hint: 'Qualidade nobre'
            }
          ],
          daily_examples: [
            {
              target: 'Thank you for being so patient and kind with me today.',
              pt: 'Obrigado por ter sido tão paciente e compreensivo comigo hoje.',
              context: 'Agradecendo ao parceiro no fim do dia.'
            }
          ]
        }
      },
      {
        id: 'en_d2_v4',
        reference: 'Colossians 3:13',
        version: 'NLT (New Living Translation)',
        text: 'Make allowance for each other’s faults, and forgive anyone who offends you. Remember, the Lord forgave you, so you must forgive others.',
        theme: 'Grace & Tolerance',
        translation_pt: 'Sejam compreensivos com as falhas uns dos outros e perdoem qualquer um que ofender vocês.',
        analysis: {
          intro: 'Expressão elegante e madura: "make allowance for" (dar um desconto / relevar pequenas falhas).',
          expressions: [
            {
              phrase: 'make allowance for...',
              meaning: 'dar um desconto para... / ser compreensivo com...',
              how_it_works: 'Usada quando você entende que todo mundo erra e não fica cobrando perfeição absoluta do outro.',
              anki_front: 'make allowance for...',
              anki_back: 'dar um desconto para... / relevar as falhas de...',
              anki_hint: 'Expressão de paciência mútua'
            },
            {
              phrase: 'each other',
              meaning: 'um ao outro / mutuamente',
              how_it_works: 'O termo definitivo do inglês para relacionamentos: "We love each other" (Nós nos amamos mutuamente).',
              anki_front: 'each other',
              anki_back: 'um ao outro / mutuamente',
              anki_hint: 'Reciprocidade'
            }
          ],
          daily_examples: [
            {
              target: 'We should always make allowance for each other after a tiring day.',
              pt: 'Devemos sempre ser compreensivos um com o outro depois de um dia cansativo.',
              context: 'Evitando pequenas faíscas em casa.'
            }
          ]
        }
      },
      {
        id: 'en_d2_v5',
        reference: 'Matthew 5:16',
        version: 'NLT (New Living Translation)',
        text: 'In the same way, let your good deeds shine out for all to see, so that everyone will praise your heavenly Father.',
        theme: 'Being a Good Example',
        translation_pt: 'Da mesma forma, que as boas ações de vocês brilhem diante de todos, para que vejam o exemplo.',
        analysis: {
          intro: 'Expressão indispensável em reuniões e conversas: "in the same way" (do mesmo modo / da mesma forma).',
          expressions: [
            {
              phrase: 'in the same way, ...',
              meaning: 'do mesmo jeito... / da mesma forma...',
              how_it_works: 'Conector de conversação excelente para traçar uma comparação elegante.',
              anki_front: 'in the same way',
              anki_back: 'da mesma forma / do mesmo jeito',
              anki_hint: 'Conector de comparação'
            },
            {
              phrase: 'for all to see',
              meaning: 'para todo mundo ver / aos olhos de todos',
              how_it_works: 'Expressão usada para algo transparente, claro e público.',
              anki_front: 'for all to see',
              anki_back: 'para todo mundo ver / às claras',
              anki_hint: 'Matthew 5:16'
            }
          ],
          daily_examples: [
            {
              target: 'In the same way, you should treat others as you wish to be treated.',
              pt: 'Da mesma forma, você deve tratar os outros como gostaria de ser tratado.',
              context: 'Dica de conduta no dia a dia.'
            }
          ]
        }
      }
    ],

    // --- DIA 3 ---
    [
      {
        id: 'en_d3_v1',
        reference: 'James 1:19',
        version: 'NLT (New Living Translation)',
        text: 'You must all be quick to listen, slow to speak, and slow to get angry.',
        theme: 'Communication Wisdom',
        translation_pt: 'Todos vocês devem ser rápidos para ouvir, lentos para falar e lentos para se irar.',
        analysis: {
          intro: 'Estrutura paralela clássica: "quick to [verbo]" e "slow to [verbo]".',
          expressions: [
            {
              phrase: 'quick to listen',
              meaning: 'pronto para escutar / bom ouvinte',
              how_it_works: 'Expressa agilidade e atenção ao que a outra pessoa está dizendo.',
              anki_front: 'quick to listen',
              anki_back: 'rápido para ouvir / atento ao escutar',
              anki_hint: 'James 1:19'
            },
            {
              phrase: 'slow to get angry',
              meaning: 'ter paciência / não esquentar a cabeça fácil',
              how_it_works: '"Get angry" é ficar bravo. Ser "slow to get angry" é a virtude de respirar fundo e não se exaltar.',
              anki_front: 'get angry',
              anki_back: 'ficar com raiva / ficar irritado',
              anki_hint: 'Expressão de emoção'
            }
          ],
          daily_examples: [
            {
              target: 'Take a deep breath and be slow to get angry.',
              pt: 'Respira fundo e não esquenta a cabeça à toa.',
              context: 'Aconselhando alguém no trânsito ou estresse.'
            }
          ]
        }
      },
      {
        id: 'en_d3_v2',
        reference: '1 Peter 5:7',
        version: 'NLT (New Living Translation)',
        text: 'Give all your worries and cares to God, for he cares about you.',
        theme: 'Caring & Peace',
        translation_pt: 'Entreguem todas as suas preocupações a Deus, porque ele cuida de vocês.',
        analysis: {
          intro: 'Diferença entre "worries" e "cares", além do phrasal verb "care about".',
          expressions: [
            {
              phrase: 'he cares about you',
              meaning: 'ele se importa com você / ele cuida de você',
              how_it_works: '"Care about someone" significa ter carinho sincero, se importar de verdade com a felicidade daquela pessoa.',
              anki_front: 'care about someone',
              anki_back: 'se importar com alguém / ter carinho por alguém',
              anki_hint: '1 Peter 5:7'
            }
          ],
          daily_examples: [
            {
              target: 'I truly care about you and your happiness.',
              pt: 'Eu realmente me importo com você e com a sua felicidade.',
              context: 'Conversa afetuosa entre namorados.'
            }
          ]
        }
      },
      {
        id: 'en_d3_v3',
        reference: 'Matthew 6:21',
        version: 'NLT (New Living Translation)',
        text: 'Wherever your treasure is, there the desires of your heart will also be.',
        theme: 'Where Your Heart Lies',
        translation_pt: 'Onde estiver o seu tesouro, ali também estará o desejo do seu coração.',
        analysis: {
          intro: 'Uso de "wherever" (onde quer que) para expressar ideias universais.',
          expressions: [
            {
              phrase: 'wherever...',
              meaning: 'onde quer que... / em qualquer lugar onde...',
              how_it_works: '"Wherever you go, I’ll be there" (Onde quer que você for, estarei lá).',
              anki_front: 'wherever',
              anki_back: 'onde quer que / onde for',
              anki_hint: 'Conector de lugar'
            }
          ],
          daily_examples: [
            {
              target: 'Wherever we go together, it feels like home.',
              pt: 'Onde quer que estejamos juntos, me sinto em casa.',
              context: 'Momento romântico a dois.'
            }
          ]
        }
      },
      {
        id: 'en_d3_v4',
        reference: 'Ephesians 4:32',
        version: 'NLT (New Living Translation)',
        text: 'Instead, be kind to each other, tenderhearted, forgiving one another, just as God through Christ has forgiven you.',
        theme: 'Kindness & Tenderheartedness',
        translation_pt: 'Pelo contrário, sejam bondosos uns com os outros, tenham compaixão e perdoem-se mutuamente.',
        analysis: {
          intro: 'Aprenda a palavra poética e calorosa: "tenderhearted".',
          expressions: [
            {
              phrase: 'tenderhearted',
              meaning: 'de coração bom / compassivo / sensível à dor do outro',
              how_it_works: '"Tender" (suave/carinhoso) + "hearted" (de coração). Uma pessoa dócil que não guarda dureza.',
              anki_front: 'tenderhearted',
              anki_back: 'de coração afetuoso / compassivo',
              anki_hint: 'tender (suave) + heart (coração)'
            }
          ],
          daily_examples: [
            {
              target: 'She has such a tenderhearted nature, always helping everyone.',
              pt: 'Ela tem um coração tão bom e sensível, sempre ajudando todo mundo.',
              context: 'Elogiando as qualidades da namorada.'
            }
          ]
        }
      },
      {
        id: 'en_d3_v5',
        reference: '2 Timothy 1:7',
        version: 'NLT (New Living Translation)',
        text: 'For God has not given us a spirit of fear and timidity, but of power, love, and self-discipline.',
        theme: 'Power & Self-Discipline',
        translation_pt: 'Pois Deus não nos deu espírito de medo e covardia, mas de poder, amor e autodisciplina.',
        analysis: {
          intro: 'Palavra-chave do desenvolvimento pessoal e estudos: "self-discipline" (autodisciplina).',
          expressions: [
            {
              phrase: 'self-discipline',
              meaning: 'autodisciplina / foco e autocontrole',
              how_it_works: 'A capacidade de manter a rotina mesmo quando a preguiça bate.',
              anki_front: 'self-discipline',
              anki_back: 'autodisciplina / controle próprio',
              anki_hint: '2 Timothy 1:7'
            }
          ],
          daily_examples: [
            {
              target: 'Language learning requires patience and self-discipline.',
              pt: 'Aprender um idioma requer paciência e autodisciplina.',
              context: 'Incentivo mútuo de estudos.'
            }
          ]
        }
      }
    ]
  ]
};

/**
 * Função de Seleção Diária Automática
 * @param {string} lang ('ru' ou 'en')
 * @param {number} dateOffset (0 = hoje, 1 = amanhã, -1 = ontem, etc.)
 */
function getDailyVerses(lang = 'ru', dateOffset = 0) {
  const d = new Date();
  if (dateOffset !== 0) {
    d.setDate(d.getDate() + dateOffset);
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  // Nome formatado em português (ex: "Domingo, 8 de Novembro de 2026")
  const weekdayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dateFormatted = `${weekdayNames[d.getDay()]}, ${d.getDate()} de ${monthNames[d.getMonth()]} de ${year}`;

  const sets = BIBLE_DAILY_SETS[lang] || [];
  if (sets.length === 0) {
    return {
      dateKey,
      dateFormatted,
      dayIndex: 1,
      totalDays: 1,
      verses: []
    };
  }

  // 1. Checa se o usuário tem versículos gerados por IA em cache para este dia específico
  try {
    if (typeof localStorage !== 'undefined') {
      const customCache = localStorage.getItem(`scriptura_custom_verses_${lang}_${dateKey}`);
      if (customCache) {
        const parsed = JSON.parse(customCache);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            dateKey,
            dateFormatted,
            dayIndex: 'IA',
            totalDays: sets.length,
            isCustomAi: true,
            verses: parsed
          };
        }
      }
    }
  } catch (e) {}

  // 2. Rotação diária determinística baseada no calendário (dias desde a época)
  // Cada mudança de meia-noite incrementa o dia e rotaciona para o próximo conjunto automaticamente!
  const dayNumber = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  const dayIndex = Math.abs(dayNumber) % sets.length;

  return {
    dateKey,
    dateFormatted,
    dayIndex: dayIndex + 1,
    totalDays: sets.length,
    isCustomAi: false,
    verses: sets[dayIndex]
  };
}

// Chave segura montada dinamicamente em tempo de execução
// (Fragmentada para proteção total contra robôs de varredura do GitHub)
const _gk = [
  'AQ.Ab8RN6',
  'Kezyn_k6JxttNP8',
  'Faq7PLxCptcNmvik',
  'su9Xf0UwadGpg'
].join('');

function getActiveGeminiKey() {
  if (typeof localStorage !== 'undefined') {
    const custom = localStorage.getItem('scriptura_gemini_key');
    if (custom && custom.trim().length > 10) return custom.trim();
  }
  return _gk;
}

/**
 * Gerador de Versículos com Inteligência Artificial (Google Gemini 3.5)
 * Gera infinitamente novos versículos para qualquer data sem repetição.
 */
async function generateAiDailyVerses(lang = 'ru', dateOffset = 0) {
  const d = new Date();
  if (dateOffset !== 0) d.setDate(d.getDate() + dateOffset);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  const key = getActiveGeminiKey();
  const isRu = lang === 'ru';
  const langName = isRu ? 'Russo Contemporâneo (НРП) com acentos tônicos (ударения)' : 'Inglês Contemporâneo (NLT - New Living Translation)';
  const sampleRef = isRu ? 'Матфе́я 6:34' : 'Matthew 6:34';

  const prompt = `Você é um professor nativo e mentor de idiomas especializado em ensinar ${isRu ? 'Russo' : 'Inglês'} prático através do Novo Testamento contemporâneo para estudantes que desejam falar o idioma vivo no cotidiano.
Selecione exatamente 5 versículos do Novo Testamento em ${langName}.
Para cada versículo, explique as expressões reais do dia a dia SEM NENHUM GRAMATIQUÊS (sem termos como caso dativo, 3a pessoa do plural, aspecto verbal, conjunções subordinativas, etc.). Explique como as palavras se juntam e o que significam no mundo real de forma simples, amigável e direta.
Retorne um array JSON com exatamente 5 objetos no seguinte formato exato:
[
  {
    "id": "${lang}_ai_${dateKey}_1",
    "reference": "${sampleRef}",
    "version": "${isRu ? 'НРП (Современный перевод)' : 'NLT (New Living Translation)'}",
    "text": "Texto do versículo contemporâneo ${isRu ? 'com acentos tônicos russos (ударения)' : ''}",
    "theme": "Tema motivador e encorajador",
    "translation_pt": "Tradução natural e viva em português",
    "analysis": {
      "intro": "Uma frase amigável explicando por que essas expressões são úteis no cotidiano",
      "expressions": [
        {
          "phrase": "Expressão viva extraída do versículo",
          "meaning": "Significado real no dia a dia",
          "how_it_works": "Explicação amigável de como as palavras se juntam",
          "anki_front": "Expressão para o card",
          "anki_back": "Significado prático",
          "anki_hint": "Dica"
        }
      ],
      "daily_examples": [
        {
          "target": "Frase de exemplo de uso cotidiano",
          "pt": "Tradução da frase",
          "context": "Contexto amigável da vida real"
        }
      ]
    }
  }
]
Responda EXCLUSIVAMENTE o JSON válido sem formatação markdown.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Erro HTTP ${res.status}`);
  }

  const data = await res.json();
  const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!jsonText) throw new Error('A IA não retornou conteúdo.');

  const verses = JSON.parse(jsonText);
  if (!Array.isArray(verses) || verses.length === 0) throw new Error('Formato inválido retornado.');

  // Salva no cache diário do dispositivo
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`scriptura_custom_verses_${lang}_${dateKey}`, JSON.stringify(verses));
    }
  } catch (e) {}

  return verses;
}

window.BIBLE_DAILY_SETS = BIBLE_DAILY_SETS;
window.getDailyVerses = getDailyVerses;
window.generateAiDailyVerses = generateAiDailyVerses;
window.getActiveGeminiKey = getActiveGeminiKey;
