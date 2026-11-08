/**
 * Bible Data & Lessons (Sem Gramatiquês - 100% Linguagem Prática)
 * Explicações diretas de como as palavras se juntam e o que significam no mundo real.
 */

const BIBLE_SETS = {
  // ================= RUSSO (НРП - Novo Russo Contemporâneo) =================
  ru: [
    {
      id: 'ru_v1',
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
      id: 'ru_v2',
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
            pt: 'Quem procura, sempre acha.',
            context: 'Incentivando alguém a não desistir de procurar uma vaga ou solução.'
          }
        ]
      }
    },
    {
      id: 'ru_v3',
      reference: 'Иоа́нна 14:27',
      version: 'НРП (Современный перевод)',
      text: 'Мир оставля́ю вам, Мой мир даю́ вам. Пусть ничто́ не трево́жит ва́ше се́рдце, не бо́йтесь.',
      theme: 'Tranquilidade e Confiança',
      translation_pt: 'Deixo com vocês a paz, dou a vocês a minha paz. Que nada perturbe o coração de vocês, não tenham medo.',
      analysis: {
        intro: 'Duas expressões de ouro para quando você quer desejar o bem ou acalmar o coração de alguém.',
        expressions: [
          {
            phrase: 'пусть [что-то]...',
            meaning: 'que [algo aconteça] / tomara que... / deixe que...',
            how_it_works: 'A palavra "Пусть" é um atalho que os russos usam para desejar coisas boas. É o nosso "Que...". Por exemplo: se você quer dizer "Que tudo dê certo!", você só diz "Пусть всё будет хорошо!". Você vai usar essa palavra em quase todo aniversário ou despedida.',
            anki_front: 'Пусть...',
            anki_back: 'Que... (usado para desejar coisas boas)',
            anki_hint: 'Palavra para desejar que algo aconteça'
          },
          {
            phrase: 'не бо́йся / не бо́йтесь',
            meaning: 'não tenha medo / não se assuste / fica tranquilo',
            how_it_works: 'É a frase mais falada na Rússia quando alguém está com medo de tentar algo novo. Se você estiver incentivando sua namorada a falar russo, basta dizer com carinho: "Не бо́йся!" (Não tenha medo, vai em frente!).',
            anki_front: 'не бо́йся!',
            anki_back: 'não tenha medo! / relaxa! / não se assuste!',
            anki_hint: 'Frase de coragem e apoio'
          }
        ],
        daily_examples: [
          {
            target: 'Пусть всё бу́дет хорошо́!',
            pt: 'Que tudo fique bem! / Vai dar tudo certo!',
            context: 'Desejando sorte antes de uma entrevista ou viagem.'
          },
          {
            target: 'Не бо́йся, у тебя́ всё полу́чится!',
            pt: 'Não tenha medo, você vai conseguir!',
            context: 'Incentivando nos estudos ou num desafio novo.'
          }
        ]
      }
    },
    {
      id: 'ru_v4',
      reference: 'Филиппи́йцам 4:6',
      version: 'НРП (Современный перевод)',
      text: 'Ни о чём не беспоко́йтесь, но во всём открыва́йте ва́ши жела́ния Бо́гу.',
      theme: 'Desabafo e Expressão',
      translation_pt: 'Não fiquem preocupados com coisa alguma, mas em tudo apresentem seus pedidos.',
      analysis: {
        intro: 'Como dizer "não esquente a cabeça com nada" do jeito que um nativo fala.',
        expressions: [
          {
            phrase: 'ни о чём не...',
            meaning: 'com nada / sobre nada / com coisa alguma',
            how_it_works: 'Em português dizemos "não se preocupe com nada". Os russos pegam a palavra "nada" e enfiam o "о" (com/sobre) bem no meio dela, virando "ни + о + чём", e repetem o "не" (não). Juntando tudo com preocupar, quer dizer: não esquenta a cabeça com absolutamente nada deste mundo!',
            anki_front: 'ни о чём не...',
            anki_back: 'com nada / a respeito de nada',
            anki_hint: 'Expressão para "com absolutamente nada"'
          },
          {
            phrase: 'не беспоко́йся',
            meaning: 'não se preocupe / não perca o sono',
            how_it_works: 'A palavra "покой" significa paz e descanso. O comecinho "бес-" significa "sem". Então essa palavra quer dizer literalmente: "não fique sem paz / não perca o seu sossego".',
            anki_front: 'не беспоко́йся!',
            anki_back: 'não se preocupe! / não perca o sossego!',
            anki_hint: 'Sinônimo carinhoso de relaxar'
          }
        ],
        daily_examples: [
          {
            target: 'Ни о чём не беспоко́йся, я обо всём позабо́чусь.',
            pt: 'Não se preocupe com nada, eu cuido de tudo.',
            context: 'Tranquilizando a namorada em um momento de estresse.'
          }
        ]
      }
    },
    {
      id: 'ru_v5',
      reference: 'Римля́нам 12:21',
      version: 'НРП (Современный перевод)',
      text: 'Не будь побеждён злом, но побежда́й зло добро́м.',
      theme: 'Resiliência e Postura',
      translation_pt: 'Não seja vencido pelo mal, mas vença o mal com o bem.',
      analysis: {
        intro: 'Uma lição prática de como responder com bondade e resolver problemas na paz.',
        expressions: [
          {
            phrase: 'добро́м',
            meaning: 'usando o bem / na base da bondade / com o bem',
            how_it_works: 'A palavra "добро́" é o bem, a bondade. Quando eles mudam o finalzinho para "добро́м", a palavra passa a significar automaticamente: "USANDO o bem como ferramenta", sem precisar falar a palavra "com". É o nosso: vamos resolver isso na boa, com o bem.',
            anki_front: 'добро́м',
            anki_back: 'usando o bem / com bondade / na boa',
            anki_hint: 'A palavra bem com sentido de "usando o bem"'
          }
        ],
        daily_examples: [
          {
            target: 'Дава́й реши́м э́тот вопро́с добро́м, мирно.',
            pt: 'Vamos resolver essa questão numa boa, na paz.',
            context: 'Propondo resolver um desentendimento com calma.'
          }
        ]
      }
    }
  ],

  // ================= INGLÊS (NLT - New Living Translation) =================
  en: [
    {
      id: 'en_v1',
      reference: 'Matthew 6:34',
      version: 'NLT (New Living Translation)',
      text: 'So don’t worry about tomorrow, for tomorrow will bring its own worries. Today’s trouble is enough for today.',
      theme: 'Present Moment & Mental Clarity',
      translation_pt: 'Portanto, não se preocupe com o amanhã, pois o amanhã trará suas próprias preocupações. Os problemas de hoje bastam para hoje.',
      analysis: {
        intro: 'Expressões fundamentais para conversas sobre rotina e limites de estresse.',
        expressions: [
          {
            phrase: 'worry about...',
            meaning: 'se preocupar com...',
            how_it_works: 'Muitos brasileiros erram dizendo "worry with". Mas em inglês nativo, a palavra "worry" anda SEMPRE colada com "about". Sempre que você for falar que está preocupado com algo, diga: "I worry about it".',
            anki_front: 'worry about [something]',
            anki_back: 'preocupar-se com algo (sempre use about)',
            anki_hint: 'Par inseparável: worry + about'
          },
          {
            phrase: 'enough for today',
            meaning: 'já chega por hoje / já deu por hoje',
            how_it_works: '"enough" significa suficiente, e "for today" é para hoje. Juntas, formam a frase mais usada nos EUA quando o expediente acaba ou você cansa de estudar: "That’s enough for today!" (Por hoje já deu!).',
            anki_front: 'enough for today',
            anki_back: 'já é o bastante por hoje / chega por hoje',
            anki_hint: 'Frase para encerrar o dia de trabalho'
          }
        ],
        daily_examples: [
          {
            target: 'Don’t worry about the presentation, you’re well prepared.',
            pt: 'Não se preocupe com a apresentação, você está bem preparado.',
            context: 'Apoiando um colega de trabalho antes de uma reunião.'
          },
          {
            target: 'That’s definitely enough work for today, let’s grab dinner.',
            pt: 'Definitivamente já deu de trabalho por hoje, vamos jantar.',
            context: 'Convidando para sair no fim do dia.'
          }
        ]
      }
    },
    {
      id: 'en_v2',
      reference: 'Matthew 7:7',
      version: 'NLT (New Living Translation)',
      text: 'Keep on asking, and you will receive what you ask for. Keep on seeking, and you will find. Keep on knocking, and the door will be opened to you.',
      theme: 'Persistence & Proactivity',
      translation_pt: 'Continue pedindo, e você receberá o que pediu. Continue buscando, e encontrará. Continue batendo, e a porta será aberta para você.',
      analysis: {
        intro: 'Como expressar insistência e pedir coisas em inglês sem soar robótico.',
        expressions: [
          {
            phrase: 'keep on [doing something]',
            meaning: 'continue fazendo... / não pare de fazer...',
            how_it_works: '"Keep" sozinho significa guardar. Mas quando você junta "keep on" com uma ação terminada em -ing (ex: asking, trying), o significado muda totalmente para: "continue insistindo sem parar!". Ex: "Keep on going!" (Continue em frente!).',
            anki_front: 'keep on + [ação]',
            anki_back: 'continue fazendo... / persista naquilo',
            anki_hint: 'Expressão de persistência'
          },
          {
            phrase: 'ask for [something]',
            meaning: 'pedir algo / solicitar algo',
            how_it_works: 'Se você falar apenas "ask", parece que você vai fazer uma pergunta. Mas quando você cola o "for" depois ("ask for"), significa pedir algo físico ou um favor. Exemplo: "ask for the bill" (pedir a conta no restaurante).',
            anki_front: 'ask for...',
            anki_back: 'pedir por... (solicitar algo, ex: a conta)',
            anki_hint: 'ask + for'
          }
        ],
        daily_examples: [
          {
            target: 'Just keep on trying, you’ll get the hang of it soon!',
            pt: 'Apenas continue tentando, logo você pega o jeito!',
            context: 'Incentivando quem está aprendendo uma coisa nova.'
          },
          {
            target: 'Did you ask for the check yet?',
            pt: 'Você já pediu a conta?',
            context: 'No restaurante com amigos.'
          }
        ]
      }
    },
    {
      id: 'en_v3',
      reference: 'John 14:27',
      version: 'NLT (New Living Translation)',
      text: 'I am leaving you with a gift—peace of mind and heart. And the peace I give is a gift the world cannot give. So don’t be troubled or afraid.',
      theme: 'Mental Peace & Composure',
      translation_pt: 'Deixo com vocês um presente — paz de espírito e de coração. E a paz que eu dou é um presente que o mundo não pode dar. Por isso, não fiquem perturbados nem com medo.',
      analysis: {
        intro: 'A expressão número um em inglês para tranquilidade e cabeça fresca.',
        expressions: [
          {
            phrase: 'peace of mind',
            meaning: 'paz de espírito / mente tranquila / sem neuras',
            how_it_works: '"peace" é paz e "mind" é mente. Os nativos usam essa expressão sempre que querem falar daquela sensação gostosa de alívio e segurança, quando suas contas estão pagas e nada tira seu sono.',
            anki_front: 'peace of mind',
            anki_back: 'paz de espírito / mente tranquila',
            anki_hint: 'peace (paz) + mind (mente)'
          }
        ],
        daily_examples: [
          {
            target: 'Having an emergency fund gives you great peace of mind.',
            pt: 'Ter uma reserva de emergência te dá uma grande paz de espírito.',
            context: 'Conversando sobre planejamento de vida.'
          }
        ]
      }
    },
    {
      id: 'en_v4',
      reference: 'Philippians 4:6',
      version: 'NLT (New Living Translation)',
      text: 'Don’t worry about anything; instead, pray about everything. Tell God what you need, and thank him for all he has done.',
      theme: 'Replacing Worry with Action',
      translation_pt: 'Não fiquem preocupados com coisa alguma; em vez disso, orem sobre tudo. Falem o que precisam e agradeçam.',
      analysis: {
        intro: 'Como contrapor ideias e como agradecer do jeito correto em conversas cotidianas.',
        expressions: [
          {
            phrase: 'instead, [action]',
            meaning: 'em vez disso / ao invés de fazer isso',
            how_it_works: 'É a palavra perfeita para redirecionar um assunto ou propor um plano melhor. Quando alguém começa a entrar em pânico, você diz: "Don’t panic; instead, let’s find a solution" (Não entre em pânico; em vez disso, vamos achar uma solução).',
            anki_front: 'instead',
            anki_back: 'em vez disso / ao invés',
            anki_hint: 'Palavra para propor outra alternativa'
          },
          {
            phrase: 'thank you for...',
            meaning: 'obrigado por...',
            how_it_works: 'Em inglês, o motivo do agradecimento vem SEMPRE com a palavra "for". Exemplo: "Thank you for the coffee" (Obrigado pelo café), "Thank you for helping me" (Obrigado por me ajudar).',
            anki_front: 'thank you for...',
            anki_back: 'obrigado por... (sempre use com for)',
            anki_hint: 'thank you + for'
          }
        ],
        daily_examples: [
          {
            target: 'Don’t panic; instead, let’s find a quick solution.',
            pt: 'Não entre em pânico; em vez disso, vamos achar uma solução rápida.',
            context: 'Diante de um imprevisto prático.'
          },
          {
            target: 'Thank you for taking the time to explain this to me.',
            pt: 'Obrigado por ter dedicado esse tempo para me explicar isso.',
            context: 'Agradecendo alguém que te deu atenção.'
          }
        ]
      }
    },
    {
      id: 'en_v5',
      reference: 'Romans 12:21',
      version: 'NLT (New Living Translation)',
      text: 'Don’t let evil conquer you, but conquer evil by doing good.',
      theme: 'Action over Reaction',
      translation_pt: 'Não deixe o mal dominar você, mas vença o mal praticando o bem.',
      analysis: {
        intro: 'Como expressar a forma ou método pelo qual você atinge um objetivo na vida real.',
        expressions: [
          {
            phrase: 'by doing...',
            meaning: 'fazendo tal coisa / através dessa ação',
            how_it_works: 'Em inglês, sempre que você quiser explicar COMO você fez algo, você coloca a palavra "by" antes da ação terminada em -ing. Por exemplo: "You learn Russian by listening every day" = Você aprende russo escutando todos os dias.',
            anki_front: 'by + [ação]-ing',
            anki_back: 'através de... / fazendo tal coisa',
            anki_hint: 'Como explicar o método de fazer algo'
          },
          {
            phrase: 'don’t let it...',
            meaning: 'não deixe isso acontecer / não permita',
            how_it_works: 'Frase pronta de apoio. Quando algo estiver querendo desanimar você ou sua namorada: "Don’t let it stop you!" (Não deixe isso parar você!).',
            anki_front: 'don’t let it...',
            anki_back: 'não deixe isso acontecer!',
            anki_hint: 'Frase pronta de encorajamento'
          }
        ],
        daily_examples: [
          {
            target: 'You can improve your English by reading 10 minutes a day.',
            pt: 'Você pode melhorar seu inglês lendo 10 minutos por dia.',
            context: 'Dica prática de estudo.'
          }
        ]
      }
    }
  ]
};

function getDailyVerses(lang = 'ru') {
  return BIBLE_SETS[lang] || [];
}

window.BIBLE_SETS = BIBLE_SETS;
window.getDailyVerses = getDailyVerses;
