"""Génère le modèle PDF remplissable PEAK EXCHANGE avec ReportLab."""

import argparse
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph


INK = HexColor("#0b0d12")
MUTED = HexColor("#494b51")
COPPER = HexColor("#895936")
LINE = HexColor("#d9d1c6")
PAPER = HexColor("#fbf9f5")
WIDTH, HEIGHT = A4
MARGIN = 45
COL = WIDTH - 2 * MARGIN


def generate(output, fonts):
    for label, file in [("Geist", "Geist-400.ttf"), ("GeistMedium", "Geist-500.ttf"), ("GeistMono", "GeistMono-400.ttf")]:
        pdfmetrics.registerFont(TTFont(label, str(fonts / file)))
    pdfmetrics.registerFontFamily("Geist", normal="Geist", bold="GeistMedium")
    output.parent.mkdir(parents=True, exist_ok=True)
    pdf = Canvas(str(output), pagesize=A4)
    pdf.setTitle("PEAK EXCHANGE | Note de synthèse et de conseil")
    pdf.setAuthor("PEAK FUNDING")
    page = 0
    y = 0

    def text(content, size=10, leading=14, color=MUTED, gap=9):
        nonlocal y
        style = ParagraphStyle("body", fontName="Geist", fontSize=size, leading=leading, textColor=color)
        paragraph = Paragraph(content, style)
        _, height = paragraph.wrap(COL, 795)
        paragraph.drawOn(pdf, MARGIN, y - height)
        y -= height + gap

    def link(label, url):
        return f'<link href="{url}" color="#895936"><u>{label}</u></link>'

    def start(section, title, intro, internal=False):
        nonlocal page, y
        page += 1
        pdf.setFillColor(COPPER)
        pdf.setFont("GeistMono", 9)
        pdf.drawString(MARGIN, HEIGHT-43, "PEAK EXCHANGE")
        pdf.drawRightString(WIDTH-MARGIN, HEIGHT-43, "USAGE CABINET" if internal else section.upper())
        pdf.setStrokeColor(LINE)
        pdf.line(MARGIN, HEIGHT-55, WIDTH-MARGIN, HEIGHT-55)
        pdf.setStrokeColor(COPPER)
        pdf.line(MARGIN, HEIGHT-55, MARGIN+41, HEIGHT-55)
        y = HEIGHT - 78
        text(title, 29, 32, INK, 12)
        text(intro, 10.4, 15, MUTED, 18)

    def finish(internal=False):
        if y < 53:
            raise ValueError(f"Contenu hors zone page {page}, y={y}")
        pdf.setStrokeColor(LINE)
        pdf.line(MARGIN, 43, WIDTH-MARGIN, 43)
        pdf.setFillColor(MUTED)
        pdf.setFont("GeistMono", 7.5)
        label = "Fiche interne à conserver au dossier" if internal else "PEAK FUNDING  /  Note confidentielle"
        pdf.drawString(MARGIN, 27, label)
        pdf.drawRightString(WIDTH-MARGIN, 27, f"{page:02d} / 08")
        pdf.showPage()

    def heading(label):
        text(label, 13.5, 17, INK, 8)

    def widget(name, label, x, top, width, height, multiline=False, maxlen=None):
        pdf.setFillColor(INK)
        pdf.setFont("GeistMedium", 9.4)
        pdf.drawString(x, top, label)
        pdf.acroForm.textfield(
            name=name, tooltip=label, x=x, y=top-9-height, width=width, height=height,
            value="", fontName="Helvetica", fontSize=10, textColor=INK,
            borderStyle="solid", borderColor=LINE, borderWidth=0.7, fillColor=PAPER,
            fieldFlags="multiline doNotScroll" if multiline else "doNotScroll",
            maxlen=maxlen or (int((width-16)/5.4) * max(1, int((height-9)/13))),
            forceBorder=True,
        )

    def field(name, label, height=52):
        nonlocal y
        widget(name, label, MARGIN, y, COL, height, height>27)
        y -= height+27

    def row(*fields):
        nonlocal y
        gap = 13
        width = (COL-gap*(len(fields)-1))/len(fields)
        for index, (name, label) in enumerate(fields):
            widget(name, label, MARGIN+index*(width+gap), y, width, 24)
        y -= 50

    def check(name, label):
        nonlocal y
        pdf.acroForm.checkbox(
            name=name, tooltip=label, x=MARGIN, y=y-11, size=11, buttonStyle="check",
            fillColor=PAPER, borderColor=COPPER, borderWidth=0.7, textColor=INK,
        )
        style = ParagraphStyle("check", fontName="Geist", fontSize=9.5, leading=13, textColor=INK)
        paragraph = Paragraph(label, style)
        _, height = paragraph.wrap(COL-20, 400)
        paragraph.drawOn(pdf, MARGIN+20, y-height+1)
        y -= max(height, 12)+10

    start("Synthèse du rendez-vous", "Note de synthèse<br/>et de conseil", "À renseigner pendant le rendez-vous, puis à relire avant de remettre la note au client. Dater les données et distinguer les éléments déclarés, les pièces vérifiées et les hypothèses.")
    row(("reference", "Référence du dossier"), ("rdv_date", "Date du rendez-vous"), ("analyse_date", "Date de l’analyse"))
    row(("client", "Client / emprunteur(s)"), ("conseiller", "Conseiller et fonction"))
    row(("qualite_client", "Particulier ou professionnel"), ("nature_financement", "Type de crédit / régime applicable"))
    field("projet", "Projet, porteur, objet, budget et échéances", 71)
    field("objectifs", "Objectifs, priorités et préférences du client", 71)
    field("experience", "Connaissances, expérience du crédit et besoins d’explication", 58)
    field("conclusion_courte", "Synthèse du conseil et prochaine décision du client", 72)
    finish()

    start("Profil financier", "Situation et capacité", "Renseigner les montants, leur périodicité et la date de référence. Pour une société, préciser les exercices, les flux utiles et les engagements des associés.")
    field("ressources", "Ressources, stabilité des revenus ou flux de l’entreprise", 63)
    field("charges", "Charges du foyer ou de la société, prêts en cours et cautions", 63)
    field("patrimoine", "Patrimoine, liquidités, apport mobilisable et réserve de sécurité", 61)
    field("pieces", "Documents examinés, sources et données manquantes", 64)
    field("capacite", "Capacité estimée et méthode de calcul", 75)
    text("Noter les hypothèses de durée, taux, assurance, revenus retenus et charges. La capacité estimée dépend de ces hypothèses et des critères du prêteur.", 9, 13)
    finish()

    start("Analyse du projet", "Analyse et argumentation", "Relier chaque constat à un fait du dossier. Indiquer le contexte économique et bancaire utile, daté et sourcé, ainsi que son effet concret sur le projet.")
    field("points_forts", "Points forts et éléments qui les démontrent", 73)
    field("points_attention", "Points d’attention et leviers d’amélioration", 74)
    field("contexte", "Contexte bancaire, économique ou politique et sources", 59)
    field("scenarios", "Scénarios envisagés, caractéristiques et compromis", 61)
    field("risques", "Risques expliqués et conséquences pour le client", 89)
    text("Préciser selon le dossier l’effet des garanties, du taux variable, du différé, de la devise ou d’une baisse des revenus. Adapter les explications à l’expérience du client.", 9, 13)
    finish()

    start("Annexe selon la mission", "Contrats examinés", "Joindre cette page si des contrats ont été étudiés. En crédit immobilier relevant de l’article L. 313-1, une recommandation de contrat repose sur une gamme d’au moins trois contrats distincts. Un panel suffisamment large est requis pour qualifier le conseil d’indépendant.")
    row(("nombre_contrats", "Nombre total de contrats examinés"), ("date_panel", "Marché consulté le"))
    field("panel", "Périmètre de recherche, critères et sources du panel", 57)
    for index in range(1, 4):
        field(f"contrat_{index}", f"Contrat {index} / établissement, référence et conditions", 70)
    field("panel_complement", "Autres établissements et contrats / référence de l’annexe", 57)
    text("Pour chaque contrat, indiquer le prêteur, la date et les paramètres comparables utiles, dont montant, durée, coût ou TAEG si disponible, charges, assurance et garanties. Conserver les justificatifs au dossier.", 9, 13)
    finish()

    start("Restitution", "Conclusion et prochaines étapes", "Préciser si la note propose des pistes de préparation du dossier ou formule une recommandation de contrat. Indiquer les informations à compléter si une recommandation doit être différée.")
    field("conclusion", "Conclusion, recommandation éventuelle ou motifs de report", 104)
    field("motifs", "Motivation au regard du profil, des objectifs et des risques", 104)
    field("actions", "Actions, pièces prioritaires, échéances et points à revalider", 92)
    heading("Choix de la suite")
    text("Vous pouvez utiliser cette note pour poursuivre votre projet seul, avec PEAK FUNDING ou avec un autre cabinet de courtage. Si vous confiez ensuite votre financement à PEAK FUNDING et que le cabinet accepte de vous accompagner, sous réserve que votre dossier soit défendable, les 299 € TTC réglés pour PEAK EXCHANGE sont déduits des honoraires de courtage convenus.")
    text("La banque décide de l’octroi et des conditions du financement. Les hypothèses et les conditions des contrats examinés peuvent évoluer.", 9.5, 14)
    finish()

    start("Informations et remise", "Cabinet, recours et remise", "Compléter les références de la prestation, les éléments applicables au dossier et les modalités de remise.")
    text("<b>PEAK FUNDING</b>  /  RCS Nanterre 987 461 787<br/>99 avenue Achille Peretti, 92200 Neuilly-sur-Seine<br/>Courtier en opérations de banque et en services de paiement (COBSP). "
         f"ORIAS n° 24002546, vérifiable sur {link('orias.fr', 'https://www.orias.fr/')}."
         "<br/>ACPR, 4 place de Budapest, CS 92459, 75436 Paris Cedex 09. "
         f"{link('acpr.banque-france.fr', 'https://acpr.banque-france.fr/fr/nous-contacter-0')}")
    field("cadre_mission", "Mission convenue, limites et référence de la lettre de mission", 48)
    field("remuneration_liens", "Prix convenu, rémunérations de tiers, liens et conflits pertinents", 48)
    heading("Réclamations et médiation")
    text(f"Adressez votre réclamation au cabinet par courrier au siège ou via le {link('contact administratif', 'https://peakfunding.eu/contact/#administratif')}. Accusé de réception sous 10 jours ouvrables sauf réponse dans ce délai, et réponse sous deux mois selon les modalités du cabinet.", 9.6, 14)
    field("mediation", "Médiateur compétent applicable, coordonnées et site internet", 45)
    row(("remise_date", "Date de remise"), ("remise_canal", "Canal / support durable"), ("version", "Version de la note"))
    field("annexes", "Annexes remises et référence de la preuve de remise", 39)
    text(f"Droits et données personnelles du client. {link('Politique de confidentialité', 'https://peakfunding.eu/politique-de-confidentialite/')}", 9, 13)
    finish()

    start("Préparation de la mission", "Vérifications avant la commande", "Fiche interne à conserver au dossier. Après l’échange, remettre les pages 1 à 3, 5 et 6 au client sur support durable. Joindre la page 4 si des contrats ont été examinés. Tracer ci-dessous la remise des documents précontractuels.", True)
    check("statut_verifie", "Statut du client et nature du crédit vérifiés. Régime et qualification de la prestation déterminés selon les actes réalisés.")
    check("fiche_entree", "Fiche d’entrée en relation remise. Identité, catégorie, ORIAS, ACPR, réclamations, nature du conseil et périmètre du marché lorsque applicable.")
    check("liens_declares", "Selon le régime applicable, établissements partenaires (nombre et noms), liens significatifs (plus d’un tiers du chiffre d’affaires, participation de plus de 10 %) et modalités des rémunérations communiqués.")
    check("prix_convenu", "Périmètre, prix TTC et conditions de déduction convenus par écrit avant les travaux. Fondement de l’encaissement anticipé vérifié séparément.")
    check("documents_distance", "Pour un contrat à distance avec un consommateur, informations précontractuelles et conditions remises à temps, explications gratuites et accès à un interlocuteur humain selon le régime applicable.")
    check("retractation", "Pour les services financiers conclus à distance avec un consommateur, vérifier les exceptions, le délai de 14 jours calendaires (dès la conclusion ou la réception des informations si elle est postérieure) et la fonction de rétractation en ligne si requise. Tracer la demande expresse d’exécution anticipée et vérifier les conditions d’exécution complète par les deux parties, de remboursement et de prorata.")
    check("mediation_verifiee", "Médiateur de la consommation compétent et coordonnées vérifiés pour la prestation. Notice de confidentialité fournie lors de la collecte.")
    field("preuves_precontractuelles", "Dates, versions et preuves de remise / d’accord", 80)
    field("verification_tarif", "Validation du régime des 299 € TTC et de la déduction", 54)
    finish(True)

    start("Références", "Cadre de la prestation", "Repères opérationnels pour le cabinet, vérifiés le 14 novembre 2026. La qualification dépend des actes, du crédit concerné et des flux de rémunération.", True)
    heading("Encaissement des 299 € TTC")
    text("L’article L. 519-6 interdit d’encaisser avant le versement des fonds les frais liés à l’obtention du prêt visés par le texte. L’article L. 519-6-1 prévoit une dérogation pour le conseil indépendant au sens de L. 519-1-1. Celui-ci suppose notamment une recommandation de contrat fondée sur un panel suffisamment large et une rémunération provenant exclusivement du client, sans autre avantage économique au titre du conseil.")
    text("Faire valider avec la spécialiste le contenu réel de l’échange, l’encaissement avant déblocage et la déduction des 299 € en cas de courtage ultérieur. L’IEAM figure dans les mentions du cabinet pour les professionnels. Confirmer le médiateur compétent pour les clients consommateurs.")
    heading("Date et type de crédit")
    text("Le cadre de L. 519-1-1 vise le crédit immobilier relevant de L. 313-1 à la date de vérification. À compter du 20 novembre 2026, il vise aussi les crédits de L. 312-1, hors regroupements, sous réserve des règles transitoires. Pour un financement professionnel ou un autre crédit, vérifier le régime propre avant d’invoquer cette dérogation.")
    heading("Textes et registre")
    sources = [
        ("CMF L. 519-1-1", "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032298022"),
        ("CMF L. 519-6 et L. 519-6-1", "https://www.legifrance.gouv.fr/codes/id/LEGISCTA000022962870/"),
        ("CMF R. 519-19 à R. 519-33", "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072026/LEGISCTA000025215101/"),
        ("Conseil en crédit immobilier L. 313-13 à L. 313-15", "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032324515/"),
        ("Comparaison de contrats de crédit immobilier R. 313-12", "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036769151/2026-01-22"),
        ("Vente à distance de services financiers L. 222-1 à L. 222-18", "https://www.legifrance.gouv.fr/codes/id/LEGISCTA000053310526/2026-06-19"),
        ("Médiation de la consommation L. 616-1", "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032224762"),
        ("Ordonnance n° 2025-880, articles 88 et 99", "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052184230"),
        ("RGPD, article 13", "https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3"),
    ]
    for label, url in sources:
        text(link(label, url), 9.5, 13, gap=5)
    text("La note restitue le conseil. Conserver séparément les conditions convenues, les informations remises avant commande, le cas échéant le mandat de courtage, et la preuve de transmission de la version finale.", 9.5, 14)
    finish(True)
    pdf.save()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("--fonts", type=Path, required=True)
    args = parser.parse_args()
    generate(args.output, args.fonts)
