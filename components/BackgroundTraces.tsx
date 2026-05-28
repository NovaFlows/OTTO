export default function BackgroundTraces() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* ── Halos radiaux ── */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-chalk)) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-chalk)) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, rgb(var(--c-chalk)) 0%, transparent 70%)' }} />

      {/* ── Esquisses de fond — brouillon d'atelier ── */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full text-otto-chalk"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* ════════════════════════════
            GRAND CERCLE DE COMPOSITION
            (coin haut gauche, déborde)
            ════════════════════════════ */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.045">
          <path d="M -90,280 C -100,-60 360,-75 355,280 C 350,610 -85,625 -90,280"
            strokeWidth="1.4" strokeDasharray="7 4" />
          <path d="M -75,278 C -82,-45 345,-58 342,278 C 338,596 -68,610 -75,278"
            strokeWidth="0.5" strokeDasharray="3 5" />
          {/* rayon */}
          <path d="M 130,278 L -90,280" strokeWidth="0.4" strokeDasharray="5 4" opacity="0.5"/>
        </g>

        {/* ════════════════════════════
            ESQUISSE DANSEUSE — haut droite
            ════════════════════════════ */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.055">
          {/* tête — ovale esquissé, pas fermé */}
          <path d="M 1108,58 C 1104,38 1118,28 1135,32 C 1152,36 1158,52 1150,66 C 1142,80 1118,80 1110,68"
            strokeWidth="1.1"/>
          {/* cou + buste */}
          <path d="M 1128,80 C 1126,95 1122,118 1118,148 C 1115,165 1112,178 1110,195"
            strokeWidth="1.4"/>
          {/* bras gauche levé — arabesque */}
          <path d="M 1124,100 C 1108,82 1088,62 1068,42 C 1056,30 1044,22 1038,18"
            strokeWidth="1.1"/>
          {/* doigts effilés */}
          <path d="M 1038,18 C 1032,14 1028,16 1030,20" strokeWidth="0.7"/>
          <path d="M 1038,18 C 1034,12 1028,12 1029,18" strokeWidth="0.6"/>
          {/* bras droit tendu */}
          <path d="M 1126,108 C 1148,118 1168,124 1192,128 C 1208,131 1222,130 1232,128"
            strokeWidth="1"/>
          {/* jambe d'appui */}
          <path d="M 1110,195 C 1108,220 1106,248 1104,272 C 1102,290 1102,305 1104,318"
            strokeWidth="1.4"/>
          {/* jambe en arabesque levée derrière */}
          <path d="M 1110,195 C 1132,188 1158,178 1188,162 C 1212,148 1235,135 1258,122"
            strokeWidth="1.1"/>
          {/* pied de la jambe levée */}
          <path d="M 1258,122 C 1265,118 1270,120 1268,126" strokeWidth="0.7"/>
          {/* tutu — traits courbes flous */}
          <path d="M 1096,168 C 1104,158 1122,156 1132,162 C 1140,167 1144,174 1138,180"
            strokeWidth="0.9" strokeDasharray="4 2"/>
          <path d="M 1092,175 C 1106,168 1128,168 1140,176"
            strokeWidth="0.6" strokeDasharray="3 3"/>
        </g>

        {/* Traits gestuels / corrections autour danseuse */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.03">
          <path d="M 1060,130 C 1080,108 1108,98 1130,105" strokeWidth="0.6" strokeDasharray="5 3"/>
          <path d="M 1050,85 C 1065,70 1090,65 1110,72" strokeWidth="0.5" strokeDasharray="4 3"/>
          {/* petits x de correction */}
          <path d="M 1075,48 L 1083,56 M 1075,56 L 1083,48" strokeWidth="0.8"/>
          {/* flèche de notation */}
          <path d="M 1165,95 C 1155,85 1145,82 1135,88" strokeWidth="0.6"/>
          <path d="M 1135,84 L 1132,91 L 1140,90" strokeWidth="0.6"/>
        </g>

        {/* ════════════════════════════
            ESQUISSE CORBEAU — bas gauche
            ════════════════════════════ */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.055">
          {/* corps — ellipse esquissée */}
          <path d="M 68,715 C 64,690 88,678 112,682 C 136,686 148,705 144,726 C 140,748 118,758 94,752 C 72,746 66,730 68,715"
            strokeWidth="1.3"/>
          {/* tête */}
          <path d="M 94,684 C 92,668 108,660 122,666 C 136,672 138,686 128,694 C 118,702 96,700 94,684"
            strokeWidth="1.1"/>
          {/* bec pointu */}
          <path d="M 136,674 C 148,670 156,674 150,680 C 144,686 134,682 136,674"
            strokeWidth="0.9"/>
          {/* oeil */}
          <circle cx="116" cy="678" r="2.5" strokeWidth="0.8" fill="none"/>
          <circle cx="117" cy="678" r="0.8" fill="currentColor" opacity="0.6"/>
          {/* grande aile gauche déployée */}
          <path d="M 70,714 C 48,700 22,695 4,704 C -8,710 -10,724 2,730"
            strokeWidth="1.2"/>
          <path d="M 70,718 C 50,728 28,738 10,744 C -2,748 -8,756 0,762"
            strokeWidth="1"/>
          {/* aile droite repliée */}
          <path d="M 142,720 C 158,714 170,720 168,732"
            strokeWidth="1"/>
          {/* queue étagée */}
          <path d="M 140,738 C 155,740 168,736 175,744 C 180,750 178,758 170,758"
            strokeWidth="1.1"/>
          <path d="M 142,745 C 158,748 172,745 178,752"
            strokeWidth="0.7"/>
          {/* pattes */}
          <path d="M 88,750 L 84,774 M 84,774 L 76,784 M 84,774 L 90,786 M 84,774 L 86,786"
            strokeWidth="0.9"/>
          <path d="M 108,752 L 105,775 M 105,775 L 97,785 M 105,775 L 112,786 M 105,775 L 107,787"
            strokeWidth="0.9"/>
          {/* branche esquissée sur laquelle il est posé */}
          <path d="M -20,770 C 30,760 80,764 140,758 C 180,754 220,758 260,762"
            strokeWidth="1.8"/>
          <path d="M 5,774 C 50,768 100,772 148,766"
            strokeWidth="0.6"/>
        </g>

        {/* Traits gestuels autour corbeau */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.03">
          <path d="M 20,695 C 35,688 50,692 60,700" strokeWidth="0.6" strokeDasharray="4 3"/>
          <path d="M 165,698 C 180,692 195,696 200,704" strokeWidth="0.5" strokeDasharray="3 3"/>
          {/* ombre esquissée sous le corbeau */}
          <path d="M 60,780 C 90,790 120,792 150,786" strokeWidth="0.5" strokeDasharray="5 4" opacity="0.6"/>
        </g>

        {/* ════════════════════════════
            HACHURES COINS
            ════════════════════════════ */}

        {/* Hachures coin haut gauche */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.04">
          <path d="M 18,15 L 72,15 M 10,25 L 82,25 M 5,38 L 88,38 M 5,50 L 80,50 M 8,62 L 72,62 M 14,74 L 65,74"
            strokeWidth="0.5"/>
          {/* obliques */}
          <path d="M 20,12 L 5,65 M 35,12 L 18,70 M 52,12 L 35,72 M 68,12 L 52,72 M 82,15 L 68,70"
            strokeWidth="0.4"/>
        </g>

        {/* Hachures coin bas droit */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.04">
          <path d="M 1350,845 L 1440,845 M 1330,860 L 1440,860 M 1316,875 L 1440,875 M 1310,890 L 1440,890"
            strokeWidth="0.5"/>
          <path d="M 1350,840 L 1440,840 M 1340,850 L 1440,850"
            strokeWidth="0.3"/>
          {/* obliques */}
          <path d="M 1340,840 L 1350,900 M 1360,840 L 1375,900 M 1380,840 L 1400,900 M 1405,845 L 1420,900 M 1420,852 L 1440,900"
            strokeWidth="0.4"/>
        </g>

        {/* ════════════════════════════
            LIGNES DE CONSTRUCTION / PROPORTION
            ════════════════════════════ */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.025">
          {/* axe vertical central */}
          <path d="M 720,0 L 720,900" strokeWidth="0.4" strokeDasharray="12 6"/>
          {/* axe horizontal médian */}
          <path d="M 0,450 L 1440,450" strokeWidth="0.3" strokeDasharray="10 6"/>
          {/* marque d'intersection */}
          <path d="M 714,444 L 726,456 M 714,456 L 726,444" strokeWidth="0.9"/>
          {/* ligne de tiers haute */}
          <path d="M 0,300 L 1440,300" strokeWidth="0.25" strokeDasharray="8 8"/>
          {/* ligne de tiers basse */}
          <path d="M 0,600 L 1440,600" strokeWidth="0.25" strokeDasharray="8 8"/>
        </g>

        {/* ════════════════════════════
            TRAITS GESTUELS LIBRES
            (dispersés, organiques)
            ════════════════════════════ */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.04">
          {/* courbes amples — centre gauche */}
          <path d="M 280,320 C 310,295 358,308 375,332 C 392,356 378,378 355,372 C 332,366 320,348 328,330"
            strokeWidth="0.8"/>
          {/* arc centre droite */}
          <path d="M 1050,480 C 1080,458 1125,468 1140,492 C 1155,516 1138,540 1115,535"
            strokeWidth="0.7"/>
          {/* S courbe bas centre */}
          <path d="M 600,740 C 630,720 665,732 672,752 C 679,772 658,788 638,782"
            strokeWidth="0.6"/>
          {/* trait rapide haut centre */}
          <path d="M 580,85 C 620,68 668,78 685,102" strokeWidth="0.7"/>
          {/* trait rapide milieu droit */}
          <path d="M 1250,540 C 1280,520 1318,530 1328,552" strokeWidth="0.6"/>
          {/* trait rapide milieu gauche */}
          <path d="M 180,480 C 210,462 245,470 252,490" strokeWidth="0.5"/>
          {/* petit arc nerveux */}
          <path d="M 820,650 C 840,635 868,640 876,658" strokeWidth="0.5" strokeDasharray="5 2"/>
          {/* trait diagonal */}
          <path d="M 400,380 C 430,355 475,362 490,385" strokeWidth="0.6"/>
        </g>

        {/* Petites flèches de notation */}
        <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.035">
          <path d="M 320,240 C 340,228 368,232 382,248" strokeWidth="0.7" strokeDasharray="5 2"/>
          <path d="M 378,243 L 385,250 L 378,257" strokeWidth="0.7"/>
          <path d="M 1100,380 C 1118,368 1140,372 1150,386" strokeWidth="0.6" strokeDasharray="4 2"/>
          <path d="M 1147,381 L 1153,388 L 1146,395" strokeWidth="0.6"/>
        </g>

        {/* ════════════════════════════
            POUSSIÈRE DE CRAIE
            ════════════════════════════ */}
        <g fill="currentColor" opacity="0.055">
          <circle cx="245" cy="188" r="0.9"/>
          <circle cx="268" cy="200" r="0.5"/>
          <circle cx="238" cy="210" r="0.7"/>
          <circle cx="258" cy="175" r="0.4"/>
          <circle cx="890" cy="345" r="0.7"/>
          <circle cx="912" cy="358" r="0.5"/>
          <circle cx="902" cy="340" r="0.9"/>
          <circle cx="880" cy="365" r="0.4"/>
          <circle cx="1145" cy="485" r="0.6"/>
          <circle cx="1162" cy="498" r="0.8"/>
          <circle cx="1135" cy="494" r="0.4"/>
          <circle cx="1155" cy="475" r="0.5"/>
          <circle cx="458" cy="645" r="0.7"/>
          <circle cx="472" cy="635" r="0.5"/>
          <circle cx="445" cy="658" r="0.9"/>
          <circle cx="750" cy="118" r="0.5"/>
          <circle cx="764" cy="130" r="0.7"/>
          <circle cx="742" cy="126" r="0.4"/>
          <circle cx="575" cy="815" r="0.6"/>
          <circle cx="590" cy="828" r="0.4"/>
          <circle cx="565" cy="836" r="0.8"/>
          <circle cx="108" cy="408" r="0.5"/>
          <circle cx="122" cy="420" r="0.7"/>
          <circle cx="96" cy="418" r="0.4"/>
          <circle cx="1355" cy="295" r="0.7"/>
          <circle cx="1368" cy="308" r="0.4"/>
          <circle cx="1348" cy="310" r="0.5"/>
          <circle cx="420" cy="165" r="0.6"/>
          <circle cx="435" cy="155" r="0.8"/>
          <circle cx="410" cy="175" r="0.4"/>
          <circle cx="1050" cy="680" r="0.5"/>
          <circle cx="1065" cy="692" r="0.7"/>
          <circle cx="1042" cy="695" r="0.4"/>
        </g>

      </svg>
    </div>
  )
}
