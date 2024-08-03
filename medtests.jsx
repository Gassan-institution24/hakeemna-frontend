const { default: axios } = require("axios")

const data = [
    {
        name_english: '1,25-dihydroxy vitamin D (DHVD)',
        category: 'Biochemistry'
    },
    {
        name_english: '17 OHP (blood spot)',
        category: ' Biochemistry',
    },
    {
        name_english: '17 OHP (serum)',
        category: ' Biochemistry',
    },
    {
        name_english: 'A1AT',
        category: 'Biochemistry'
    },
    {
        name_english: 'Abdominal mass FNA',
        category: 'Non - Gynaecology Cytology',

    },
    {
        name_english: 'Abscesses and Deep- Seated Wound Infections',
        category: 'Bacteriology',

    },
    {
        name_english: ' Acetyl Choline Receptor Antibodies',
        category: ' Immunology',

    },
    {
        name_english: ' Acid base status',
        category: 'Biochemistry'
    },
    {
        name_english: ' Acid fast bacilli(mycobacteria) Special Stain',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: 'ACR',
        category: ' Biochemistry',
    },
    {
        name_english: ' Activated partial thromboplastin time',
        category: 'Haematology',

    },
    {
        name_english: ' Actual bicarbonate',
        category: 'Biochemistry',

    },
    {
        name_english: ' Acute kidney injury score',
        category: 'Biochemistry',

    },
    {
        name_english: ' Acute Leukaemia Panel',
        category: ' Immunology',
    },
    {
        name_english: ' Adenovirus',
        category: ' Microbiology',

    },
    {
        name_english: 'Adenovirus (respiratory infection)',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'Adenovirus 40/41 (Enteric) PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Adrenal antibody',
        category: ' Immunology',

    },
    {
        name_english: ' Adrenal FNA',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: ' AFP',
        category: 'Biochemistry',
    },
    {
        name_english: 'AKI',
        category: ' Biochemistry',
    },
    {
        name_english: ' Alanine Aminotransferase',
        category: 'Biochemistry',
    },
    {
        name_english: ' Albumin',
        category: 'Biochemistry',

    },
    {
        name_english: ' Albumin Creatinine Ratio(ACR)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Albumin excretion(urine micro albumin)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Aldosterone',
        category: 'Biochemistry',

    },
    {
        name_english: ' Alkaline Phosphatase',
        category: 'Biochemistry',
    },
    {
        name_english: ' Alkaline Phosphate isoenzymes',
        category: 'Biochemistry',

    },
    {
        name_english: ' Allergen Specific IgE',
        category: ' Immunology',

    },
    {
        name_english: 'ALP',
        category: ' Biochemistry',
    },
    {
        name_english: ' Alpha - 1 - Antitrypsin',
        category: 'Biochemistry',
    },
    {
        name_english: 'Alpha-feto-protein',
        category: ' Biochemistry',
    },
    {
        name_english: 'ALT',
        category: ' Biochemistry',
    },
    {
        name_english: 'AMH',
        category: ' Biochemistry',
    },
    {
        name_english: ' Amikacin',
        category: 'Biochemistry',

    },
    {
        name_english: ' Aminotransferase',
        category: 'Biochemistry',

    },
    {
        name_english: ' Ammonia',
        category: 'Biochemistry',

    },
    {
        name_english: 'ANA',
        category: ' Immunology',
    },
    {
        name_english: 'ANCA',
        category: ' Immunology',
    },
    {
        name_english: ' Androstenedione',
        category: 'Biochemistry',

    },
    {
        name_english: ' Anion - Gap',
        category: 'Biochemistry',

    },
    {
        name_english: ' Anti C1q',
        category: ' Immunology',

    },
    {
        name_english: 'Anti HBs',
        category: ' Virology',
    },
    {
        name_english: ' Anti Myelin oligodendrocyte glycoprotein(MOG) Antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Anti - Basal Ganglia Abs',
        category: ' Immunology',

    },
    {
        name_english: ' Antibiotic Susceptibility Tests',
        category: ' Bacteriology',
    },
    {
        name_english: ' Antibody screen and save serum',
        category: 'Haematology',

    },
    {
        name_english: ' Antibody titre',
        category: 'Haematology',

    },
    {
        name_english: ' Anticoagulant Control – Heparin control; Oral Anticoagulant Control(INR)',
        category: 'Haematology',

    },
    {
        name_english: ' Anti - cyclic citrullinated peptide(CCP)',
        category: ' Immunology',
    },
    {
        name_english: 'Anti-HCV antibody screen and confirmation',
        category: ' Virology',
    },
    {
        name_english: ' Anti - Hepatitis Bs antibody Virology',
        category: ' Virology',

    },
    {
        name_english: 'Anti-HIV 1 and 2 antibody and p24 antigen screen',
        category: ' Virology',
    },
    {
        name_english: 'Antimicrobial Susceptibility Test',
        category: ' Bacteriology',
    },
    {
        name_english: ' Anti - Müllerian Hormone, AMH',
        category: 'Biochemistry',

    },
    {
        name_english: ' Anti - neutrophil cytoplasmic antibody(ANCA)',
        category: ' Immunology',
    },
    {
        name_english: ' Antinuclear antibody(ANA)',
        category: ' Immunology',
    },
    {
        name_english: ' Antithrombin',
        category: 'Haematology',

    },
    {
        name_english: ' AP100 Alternative Pathway Haemolytic Complement',
        category: ' Immunology',

    },
    {
        name_english: ' APTT',
        category: 'Haematology',

    },
    {
        name_english: ' Aquaporin 4',
        category: ' Immunology',

    },
    {
        name_english: ' Ascitic fluid',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: 'ASD',
        category: ' Virology',
    },
    {
        name_english: ' Aspartate Aminotransferase',
        category: 'Biochemistry',
    },
    {
        name_english: ' Aspergillus fumigatus precipitins',
        category: ' Immunology',

    },
    {
        name_english: ' Aspergillus PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'AST',
        category: ' Bacteriology',
    },
    {
        name_english: 'AST',
        category: ' Biochemistry',
    },
    {
        name_english: 'Astrovirus PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Autoimmune diabetes marker panel',
        category: ' Immunology',

    },
    {
        name_english: ' Avian precipitins',
        category: ' Immunology',

    },
    {
        name_english: ' B Cell Maturation Panel',
        category: ' Immunology'

    },
    {
        name_english: ' Bartonella(referral)',
        category: ' Virology',

    },
    {
        name_english: ' Bence Jones protein(Urinary light chains) Urine immunofixation',
        category: ' Immunology',

    },
    {
        name_english: ' Beta 2 Glycoprotein(IgG and IgM)',
        category: ' Immunology',

    },
    {
        name_english: ' Beta Hydroxybutyrate',
        category: 'Biochemistry',

    },
    {
        name_english: ' Bicarbonate',
        category: 'Biochemistry',

    },
    {
        name_english: ' Bile acids',
        category: 'Biochemistry',

    },
    {
        name_english: ' Bile duct brushings',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: 'Bilharzia',
        category: ' Bacteriology',
    },
    {
        name_english: ' Bilirubin(conjugated / direct)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Bilirubin(total)',
        category: 'Biochemistry',

    },
    {
        name_english: ' BK virus PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Bladder washings',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: ' Blastomyces(referral)',
        category: 'Virology',

    },
    {
        name_english: ' Bleeding Time',
        category: 'Haematology',

    },
    {
        name_english: ' Blood Cultures',
        category: ' Bacteriology',

    },
    {
        name_english: ' Blood group',
        category: 'Haematology',

    },
    {
        name_english: ' Blood Transfusion',
        category: 'Haematology',

    },
    {
        name_english: ' Bloodspot 17-hydroxyprogesterone',
        category: 'Biochemistry',
    },
    {
        name_english: ' BNP(N - terminal pro BNP)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Bocavirus PCR(referral)',
        category: 'Molecular Microbiology',

    },
    {
        name_english: ' Bone marrow report',
        category: 'Haematology',

    },
    {
        name_english: 'Bordetella pertussis culture',
        category: ' Bacteriology',
    },
    {
        name_english: ' Bordetella pertussis PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Breath Hydrogen Test',
        category: 'Biochemistry',

    },
    {
        name_english: ' Bronchial brushings',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: ' Bronchial trap',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: ' Bronchoalveolar lavage',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: ' Brucella(referral)',
        category: ' Virology',

    },
    {
        name_english: ' Busulphan',
        category: 'Biochemistry',

    },
    {
        name_english: ' C1 esterase inhibitor',
        category: ' Immunology'
    },
    {
        name_english: ' C1 esterase inhibitor functional test',
        category: ' Immunology',

    },
    {
        name_english: ' C1q',
        category: ' Immunology',

    },
    {
        name_english: ' C3 nephritic factor',
        category: ' Immunology',

    },
    {
        name_english: ' CA125',
        category: 'Biochemistry',

    },
    {
        name_english: ' Caeruloplasmin',
        category: 'Biochemistry',

    },
    {
        name_english: ' Calcium(blood and urine)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Calcium ionized',
        category: 'Biochemistry',

    },
    {
        name_english: ' Calcium, plasma, total',
        category: 'Biochemistry',

    },
    {
        name_english: ' Calprotectin(faeces)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Campylobacter serology(referral)',
        category: 'Virology',

    },
    {
        name_english: 'cANCA',
        category: ' Immunology',
    },
    {
        name_english: ' Candida PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Candida precipitins(referral)',
        category: 'Virology',
    },
    {
        name_english: ' Carbamazepine',
        category: 'Biochemistry',
    },
    {
        name_english: 'Carbapenemase-Producing Enterobacteriaceae (CPE) Screen',
        category: ' Bacteriology',
    },
    {
        name_english: ' Carboxyhaemoglobin',
        category: 'Biochemistry',

    },
    {
        name_english: ' Cardiac muscle antibodies',
        category: ' Immunology',

    },
    {
        name_english: ' Cardiolipin (IgG and IgM) antibodies',
        category: ' Immunology',

    },
    {
        name_english: ' CASPR &amp; LGi1 Antibodies',
        category: ' Immunology',

    },
    {
        name_english: ' Catecholamines(urine)',
        category: 'Biochemistry',

    },
    {
        name_english: 'CCP',
        category: ' Immunology',
    },
    {
        name_english: ' CD34 (Stem cells)',
        category: ' Immunology',

    },
    {
        name_english: ' CD4 count (T cell count)',
        category: ' Immunology',

    },
    {
        name_english: ' CEA',
        category: 'Biochemistry',

    },
    {
        name_english: 'Cerebrospinal fluid',
        category: ' Bacteriology',
    },
    {
        name_english: ' Cerebrospinal fluid',
        category: ' Non - Gynaecology Cytology',

    },
    {
        name_english: ' Cervical Cytology',
        category: ' Gynaecological Cytology',

    },
    {
        name_english: ' CH50 complement activity Classical Pathway',
        category: ' Immunology',

    },
    {
        name_english: ' Chain - of - custody medico - legal specimens',
        category: 'Biochemistry',

    },
    {
        name_english: ' Chlamydia trachomatis, Neisseria gonorrhoea, Trichomonas vaginalis, Mycoplasma genitalium NAATs',
        category: ' Molecular Microbiology',

    },
    {
        name_english: ' Chloride',
        category: 'Biochemistry',

    },
    {
        name_english: ' Cholesterol',
        category: 'Biochemistry',

    },
    {
        name_english: ' Cholinesterase',
        category: 'Biochemistry',

    },
    {
        name_english: ' Chromium',
        category: 'Biochemistry',

    },
    {
        name_english: ' Chronic lymphocytic/lymphoma panel',
        category: ' Immunology',
    },
    {
        name_english: 'Ciclosporin',
        category: ' Biochemistry',
    },
    {
        name_english: 'CK',
        category: ' Biochemistry',
    },
    {
        name_english: ' Clostridium difficile GDH and Toxin',
        category: ' Bacteriology',

    },
    {
        name_english: ' CMV (cytomegalovirus) antiviral resistance markers',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' CMV (cytomegalovirus) IgG',
        category: ' Virology',
    },
    {
        name_english: ' CMV (cytomegalovirus) IgG avidity',
        category: ' Virology',
    },
    {
        name_english: ' CMV (cytomegalovirus) IgM',
        category: ' Virology',
    },
    {
        name_english: ' CMV (cytomegalovirus) viral load',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Cobalt',
        category: 'Biochemistry',

    },
    {
        name_english: ' Coccidioides(referral)',
        category: 'Virology',

    },
    {
        name_english: ' Coeliac Disease Antibodies',
        category: ' Immunology',

    },
    {
        name_english: ' Cold agglutinin titres(4°C)',
        category: 'Haematology',

    },
    {
        name_english: ' Complement C3',
        category: ' Immunology',

    },
    {
        name_english: ' Complement C4',
        category: ' Immunology',

    },
    {
        name_english: ' Contact lens',
        category: ' Bacteriology',

    },
    {
        name_english: ' Copper(blood and urine)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Cord blood investigations',
        category: 'Haematology',

    },
    {
        name_english: ' Corneal Scrape (Bacteriology)',
        category: ' Bacteriology',

    },
    {
        name_english: ' Corneal Scrape (Virology)',
        category: ' Virology',

    },
    {
        name_english: ' Coronavirus COVID-19 Testing for SARS-CoV-2',
        category: ' Molecular Microbiology',

    },
    {
        name_english: ' Cortisol',
        category: 'Biochemistry',

    },
    {
        name_english: ' COVID 19 Antibodies',
        category: ' Immunology',

    },
    {
        name_english: 'CPE screen',
        category: ' Bacteriology',
    },
    {
        name_english: ' C - peptide',
        category: 'Biochemistry',

    },
    {
        name_english: ' C - reactive protein(CRP)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Creatine Kinase',
        category: 'Biochemistry',
    },
    {
        name_english: ' Creatinine(blood and urine)',
        category: 'Biochemistry',

    },
    {
        name_english: ' Creatinine clearance',
        category: 'Biochemistry',

    },
    {
        name_english: ' Crithidia antibodies',
        category: ' Immunology',

    },
    {
        name_english: ' Cross matching',
        category: 'Haematology',

    },
    {
        name_english: ' Cryoglobulins',
        category: ' Immunology',

    },
    {
        name_english: ' Cryptococcus antigen',
        category: ' Virology',

    },
    {
        name_english: 'Cryptosporidium',
        category: ' Bacteriology',
    },
    {
        name_english: ' CSF',
        category: ' Bacteriology',

    },
    {
        name_english: ' CSF',
        category: 'Haematology',

    },
    {
        name_english: ' CSF – Glucose',
        category: 'Biochemistry',

    },
    {
        name_english: ' CSF – Lactate',
        category: 'Biochemistry',

    },
    {
        name_english: ' CSF – Protein',
        category: 'Biochemistry',

    },
    {
        name_english: 'CSF Bilirubin',
        category: ' Biochemistry',
    },
    {
        name_english: 'CSF Xanthochromia',
        category: ' Biochemistry',
    },
    {
        name_english: ' CTX',
        category: 'Biochemistry',

    },
    {
        name_english: ' Culture',
        category: ' Bacteriology',

    },
    {
        name_english: 'Cyclic citrullinated peptide (CCP)',
        category: ' Immunology',
    },
    {
        name_english: ' Cyclosporin A',
        category: 'Biochemistry',
    },
    {
        name_english: ' Cystatin C',
        category: 'Biochemistry',

    },
    {
        name_english: ' Cystic Fibrosis',
        category: ' Bacteriology',

    },
    {
        name_english: 'Cytomegalovirus (CMV) IgG',
        category: ' Virology',
    },
    {
        name_english: 'Cytomegalovirus (CMV) IgG avidity',
        category: ' Virology',
    },
    {
        name_english: 'Cytomegalovirus (CMV) IgM',
        category: ' Virology',
    },
    {
        name_english: 'Cytomegalovirus anitviral resistance markers',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'Cytomegalovirus viral load',
        category: ' Molecular Microbiology',
    },

    {
        name_english: ' DHEA – sulphate',
        category: 'Biochemistry'
    },
    {
        name_english: ' Digoxin',
        category: 'Biochemistry',
    },
    {
        name_english: ' Diphtheria IgG antibody determination',
        category: ' Vaccine Evaluation Unit',

    },
    {
        name_english: ' Direct Antiglobulin Test',
        category: 'Haematology',

    },
    {
        name_english: ' DNA Testing for the Haemoglobinopathies',
        category: 'Haematology',

    },
    {
        name_english: ' Double Negative T Cell (DNT) panel',
        category: 'Immunology',

    },
    {
        name_english: ' Double stranded DNA antibodies (IgG)',
        category: ' Immunology',

    },
    {
        name_english: 'Dried blood spot Hepatitis B core antibody',
        category: ' Virology',
    },
    {
        name_english: 'Dried blood spot Hepatitis B surface antigen',
        category: ' Virology',
    },
    {
        name_english: 'Dried blood spot Hepatitis C antibody',
        category: ' Virology',
    },
    {
        name_english: 'Dried blood spot Hepatitis C genotyping',
        category: ' Virology',
    },
    {
        name_english: ' Dried blood spot Hepatitis C RNA screening',
        category: ' Virology',

    },
    {
        name_english: 'Dried blood spot HIV Ag/Ab',
        category: ' Virology',
    },
    {
        name_english: ' Dried blood spot Syphilis antibody',
        category: ' Virology',

    },
    {
        name_english: ' Drugs of abuse(urine screen)',
        category: 'Biochemistry',

    },

    {
        name_english: ' Ear',
        category: ' Bacteriology'
    },
    {
        name_english: 'EBNA',
        category: ' Virology',
    },
    {
        name_english: ' EBV (EBNA)',
        category: ' Virology',
    },
    {
        name_english: 'EBV (Epstein Barr Virus) viral load',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'EBV VCA IgG – screening',
        category: ' Virology',
    },
    {
        name_english: 'EBV VCA IgM – screening',
        category: ' Virology',
    },
    {
        name_english: ' eGfR(estimated GfR)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Ehrlichia IF(referral)',
        category: 'Virology',
    },
    {
        name_english: ' Elastase(faeces)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Electrolytes(urine)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Electron microscopy',
        category: ' Histopathology',
    },
    {
        name_english: ' EMA binding assay for Hereditary Spherocytosis',
        category: ' Immunology',
    },
    {
        name_english: 'ENA antibodies includes: Ro (SS-A 52, SSA-60), La (SS-B), Sm, Sm/RNP, RNP (RNP A, RNP 68), Ribosomal P, Chromatin, Jo-1, and Scl-70',
        category: ' Immunology',
    },
    {
        name_english: 'Entamoeba',
        category: ' Bacteriology',
    },
    {
        name_english: ' Enteric Virus Panel',
        category: ' Virology',
    },
    {
        name_english: ' Enterovirus and parechovirus PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Enzyme histochemistry',
        category: ' Histopathology',
    },
    {
        name_english: ' EPO',
        category: 'Haematology',
    },
    {
        name_english: 'Epstein Barr Virus (EBNA) confirmation',
        category: ' Virology',
    },
    {
        name_english: 'Epstein Barr Virus (EBV) IgG – screening',
        category: ' Virology',
    },
    {
        name_english: 'Epstein Barr Virus (EBV) IgM – screening',
        category: ' Virology',
    },
    {
        name_english: ' Epstein Barr Virus screening',
        category: ' Virology',
    },
    {
        name_english: ' Epstein Barr Virus viral load',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Erythrocyte Sedimentation Rate(ESR)',
        category: 'Haematology',
    },
    {
        name_english: ' Erythropoietin',
        category: 'Haematology',
    },
    {
        name_english: ' Ethanol(drinking alcohol)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Eye',
        category: ' Bacteriology',
    },

    {
        name_english: ' Factor II assay',
        category: 'Haematology'
    },
    {
        name_english: ' Factor IX assay',
        category: 'Haematology',
    },
    {
        name_english: ' Factor IX inhibitors',
        category: 'Haematology',
    },
    {
        name_english: ' Factor V assay',
        category: 'Haematology',
    },
    {
        name_english: ' Factor V Leiden Mutation screen',
        category: 'Haematology',
    },
    {
        name_english: ' Factor VII assay',
        category: 'Haematology',
    },
    {
        name_english: ' Factor VIII assay',
        category: 'Haematology',
    },
    {
        name_english: ' Factor VIII inhibitors',
        category: 'Haematology',
    },
    {
        name_english: ' Factor X assay',
        category: 'Haematology',
    },
    {
        name_english: ' Factor XI assay',
        category: 'Haematology',
    },
    {
        name_english: ' Factor XII assay',
        category: 'Haematology',
    },
    {
        name_english: ' Faecal immunochemical testing',
        category: 'Biochemistry',
    },
    {
        name_english: ' Faecal reducing substances',
        category: 'Biochemistry',
    },
    {
        name_english: ' Faeces Culture',
        category: ' Bacteriology',
    },
    {
        name_english: ' Failing metal-on-metal prosthetic joints',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' Farmer’s lung precipitins',
        category: ' Immunology',
    },
    {
        name_english: ' FBC',
        category: 'Haematology',
    },
    {
        name_english: ' FDP D - Dimers',
        category: 'Haematology',
    },
    {
        name_english: ' Features associated with ganglia',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' Features of Juvenile inflammatory arthropathy',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' Features of rheumatoid disease',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' Ferritin',
        category: 'Biochemistry',
    },
    {
        name_english: ' Fibrin Degradation Products',
        category: 'Haematology',
    },
    {
        name_english: ' Fibrinogen',
        category: 'Haematology',
    },
    {
        name_english: 'FIT ',
        category: ' Biochemistry',
    },
    {
        name_english: ' Fluids from Normally Sterile Sites',
        category: ' Bacteriology',
    },
    {
        name_english: ' Folate(serum and red cell)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Follicle stimulating hormone',
        category: 'Biochemistry',
    },
    {
        name_english: ' Free fatty acids',
        category: 'Biochemistry',
    },
    {
        name_english: ' Free Light Chains',
        category: ' Immunology',
    },
    {
        name_english: 'Free T3',
        category: ' Biochemistry',
    },
    {
        name_english: 'Free T4',
        category: ' Biochemistry',
    },
    {
        name_english: ' Free thyroxine',
        category: 'Biochemistry',
    },
    {
        name_english: ' Free Tri-iodothyronine',
        category: 'Biochemistry',
    },
    {
        name_english: 'FSH',
        category: ' Biochemistry',
    },
    {
        name_english: ' Full blood count and automated differential',
        category: 'Haematology',
    },
    {
        name_english: 'Functional antibody to Neisseria meningitidis serogroup B by Serum Bactericidal Antibody Assay (SBA)',
        category: ' Vaccine Evaluation Unit',
    },
    {
        name_english: ' Fungi – Special Stain',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' G6PD Assay (if screen gives intermediate or reduced result)',
        category: 'Haematology'
    },
    {
        name_english: ' G6PD Screen',
        category: 'Haematology',
    },
    {
        name_english: ' GABAb receptor &amp; AMPA receptor 1/2 antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Galactomannan referral',
        category: 'Virology',
    },
    {
        name_english: ' Gamma-glutamyl transferase',
        category: 'Biochemistry',
    },
    {
        name_english: ' Ganglioside Abs GM1',
        category: ' Immunology',
    },
    {
        name_english: ' Ganglioside Abs GQ1b',
        category: ' Immunology',
    },
    {
        name_english: 'Gases',
        category: ' Biochemistry',
    },
    {
        name_english: 'Gastric Biopsies for Helicobacter pylori',
        category: ' Bacteriology',
    },
    {
        name_english: 'Gastric Parietal Cell (GPC)',
        category: ' Immunology',
    },
    {
        name_english: ' Genital specimens for culture',
        category: ' Bacteriology',
    },
    {
        name_english: ' Gentamicin',
        category: 'Biochemistry',
    },
    {
        name_english: 'GGT',
        category: ' Biochemistry',
    },
    {
        name_english: 'Giardia lamblia',
        category: ' Bacteriology',
    },
    {
        name_english: ' Glandular fever screening test',
        category: 'Haematology',
    },
    {
        name_english: ' Glomerular basement membrane antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Glucose',
        category: 'Biochemistry',
    },
    {
        name_english: ' Glutamic Acid Decarboxylase Antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Glycated Haemoglobin',
        category: 'Biochemistry',
    },
    {
        name_english: ' Glycogen – Special Stain',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' Gout (urate crystals)',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: 'GPC',
        category: ' Immunology',
    },
    {
        name_english: ' Gram +ve/-ve sepsis',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' Growth Hormone',
        category: 'Biochemistry',
    },

    {
        name_english: ' Haematinics –  Serum intrinisic factor antibodies',
        category: 'Haematology'
    },
    {
        name_english: ' Haemochromatosis C282Y, H63D and S65C genotyping',
        category: 'Haematology',
    },
    {
        name_english: ' Haemoglobinopathy Screening',
        category: 'Haematology',
    },
    {
        name_english: ' Haemophilius influenze type b antibody',
        category: ' Vaccine Evaluation Unit',
    },
    {
        name_english: ' Haptoglobulin Estimation',
        category: 'Haematology',
    },
    {
        name_english: 'HAV',
        category: ' Virology',
    },
    {
        name_english: 'HbA1c',
        category: ' Biochemistry',
    },
    {
        name_english: ' HbS Screening Test – Urgent / pre - operative(Pts & gt; 1 yr Old)',
        category: 'Haematology',
    },
    {
        name_english: 'HBsAg',
        category: ' Virology',
    },
    {
        name_english: 'HBV confirmation',
        category: ' Virology',
    },
    {
        name_english: 'HBV core antibodies',
        category: ' Virology',
    },
    {
        name_english: 'HBV core antibody &#8211; Dried Blood Spot',
        category: ' Virology',
    },
    {
        name_english: 'HBV core IgM',
        category: ' Virology',
    },
    {
        name_english: 'HBV resistance markers',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'HBV surface antibody',
        category: ' Virology',
    },
    {
        name_english: ' HCG blood (pregnancy and as tumour marker)',
        category: 'Biochemistry',
    },
    {
        name_english: ' HCV genotyping',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Helicobacter pylori',
        category: ' Bacteriology',
    },
    {
        name_english: ' Helicobacter pylori in Gastric Biopsies',
        category: ' Bacteriology',
    },
    {
        name_english: ' Heparin control',
        category: 'Haematology',
    },
    {
        name_english: ' Hepatitis A total antibody (IgG and IgM)',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis A virus (HAV) IgM',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B (HBV) confirmation',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B (HBV) core antibodies',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B (HBV) core antibody – Dried Blood Spot',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B (HBV) core IgM (anti-HBc IgM)',
        category: ' Virology',
    },
    {
        name_english: 'Hepatitis B (HBV) surface antibody (Anti-HBs)',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B (HBV) surface antigen (HBsAg)',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B (HBV) surface antigen (HBsAg) – Dried Blood Spot',
        category: ' Virology',
    },
    {
        name_english: 'Hepatitis B e antibody',
        category: ' Virology',
    },
    {
        name_english: 'Hepatitis B e antigen',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B virus (HBV) e antigen (HBeAg) and e antibody (Anti-HBe)',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis B virus Genotyping and Resistance Markers',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Hepatitis B virus viral load',
        category: ' Microbiology',
    },
    {
        name_english: ' Hepatitis C antibody (HCV) screen and confirmation',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis C antibody (HCV) screen and confirmation – Dried Blood Spot',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis C qualitative PCR and genotype if HCV antibody is reactive – Dried Blood Spot',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis C viral load',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Hepatitis D (delta) antibody',
        category: ' Virology',
    },
    {
        name_english: ' Hepatitis E IgG (referral)',
        category: 'Virology',
    },
    {
        name_english: ' Hepatitis E IgM',
        category: ' Virology',
    },
    {
        name_english: ' Herpes simplex 1/2 antibody (type specific, IgM and total antibody)',
        category: ' Virology',
    },
    {
        name_english: ' Herpes simplex virus types 1 and 2 PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' HFE',
        category: 'Haematology',
    },
    {
        name_english: 'hGH',
        category: ' Biochemistry',
    },
    {
        name_english: 'HHV6 &amp; 7 PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' High Risk HPV Test of Cure',
        category: ' Gynaecological Cytology',
    },
    {
        name_english: ' High Risk HPV triage',
        category: ' Gynaecological Cytology',
    },
    {
        name_english: ' Histone Abs',
        category: ' Immunology',
    },
    {
        name_english: ' Histopathology – Paediatric Histopathology',
        category: ' Histopathology',
    },
    {
        name_english: ' Histopathology – Routine (adult) Histopathology',
        category: ' Histopathology',
    },
    {
        name_english: ' Histoplasma(referral)',
        category: ' Virology',
    },
    {
        name_english: ' HIV 1 and 2 antibody and p24 antigen screen – Dried Blood Spot',
        category: ' Virology',
    },
    {
        name_english: ' HIV confirmation (screen test plus at least two further tests for HIV 1/2) Virology',
        category: ' Virology',
    },
    {
        name_english: ' HIV p24 antigen Virology',
        category: ' Virology',
    },
    {
        name_english: ' HIV resistance, integrase, tropism Molecular Microbiology',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' HIV screen (4th generation: HIV1 and 2 antibody and p24 antigen)',
        category: ' Virology',
    },
    {
        name_english: ' HIV-1 viral load',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'HTLV 1 and 2 antibody',
        category: ' Virology',
    },
    {
        name_english: 'Human Chorionic Gonadotrophin',
        category: ' Biochemistry',
    },
    {
        name_english: ' Human Herpes virus 6 &amp; 7',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Human Papilloma Virus Screening',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Human Parvovirus B19 IgG',
        category: ' Virology',
    },
    {
        name_english: ' Human Parvovirus B19 IgM',
        category: ' Virology',
    },
    {
        name_english: ' Human Parvovirus B19 viral load',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Human T Lymphotropic virus (HTLV) 1 and 2',
        category: ' Virology',
    },

    {
        name_english: ' IA2',
        category: ' Immunology'
    },
    {
        name_english: ' IgE (Total)',
        category: ' Immunology',
    },
    {
        name_english: 'IGF-1',
        category: ' Biochemistry',
    },
    {
        name_english: 'IGFBP-3',
        category: ' Biochemistry',
    },
    {
        name_english: ' IgG subclasses',
        category: ' Immunology',
    },
    {
        name_english: ' Immunocytochemistry',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' Immunocytochemistry',
        category: ' Histopathology',
    },
    {
        name_english: ' Immunodeficiency (T&amp;B Lymphocyte Subsets)',
        category: ' Immunology',
    },
    {
        name_english: ' Immunofluorescence Histopathology',
        category: ' Histopathology',
    },
    {
        name_english: ' Immunoglobulin D, IgD',
        category: ' Immunology',
    },
    {
        name_english: ' Immunoglobulins (IgG, IgA, IgM)',
        category: ' Immunology',
    },
    {
        name_english: ' Inflammatory/non-inflammatory bursitis',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' INR',
        category: 'Haematology',
    },
    {
        name_english: ' Insulin',
        category: 'Biochemistry',
    },
    {
        name_english: ' Insulin Antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Insulin-like Growth Factor 1',
        category: 'Biochemistry',
    },
    {
        name_english: ' Insulin-like Growth Factor Binding Protein 3',
        category: 'Biochemistry',
    },
    {
        name_english: ' Intravascular cannulae',
        category: ' Bacteriology',
    },
    {
        name_english: 'Invasive infection with Aspergillus',
        category: ' Molecular Microbiology',
    },
    {
        name_english: 'Invasive infection with Candida',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Iron',
        category: 'Biochemistry',
    },

    {
        name_english: ' JC virus PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Jejunal Disaccharidases',
        category: 'Biochemistry',
    },
    {
        name_english: 'Joint fluids',
        category: ' Bacteriology',
    },

    {
        name_english: ' Kleihauer test',
        category: 'Haematology'
    },

    {
        name_english: ' Lactate',
        category: 'Biochemistry'
    },
    {
        name_english: ' Lactate Dehydrogenase(LDH)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Lamotrigine',
        category: 'Biochemistry',
    },
    {
        name_english: ' Legionella urinary antigen detection',
        category: ' Virology',
    },
    {
        name_english: ' Leptospira(referral)',
        category: 'Virology',
    },
    {
        name_english: ' Leukocyte Adhesion Deficiency (LAD) Markers',
        category: 'Immunology',
    },
    {
        name_english: 'LH',
        category: ' Biochemistry',
    },
    {
        name_english: ' Lipase(blood and fluid)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Lipid profile incl.total cholesterol, LDL, HDL, triglyceride',
        category: 'Biochemistry',
    },
    {
        name_english: ' Lithium(serum)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Liver FNA',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' Liver Function Tests',
        category: 'Biochemistry',
    },
    {
        name_english: 'Liver Kidney Microsomal (LKM)',
        category: ' Immunology',
    },
    {
        name_english: 'LKM',
        category: ' Immunology',
    },
    {
        name_english: ' L-Selectin Shedding assay',
        category: ' Immunology',
    },
    {
        name_english: ' Lung FNA',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' Lupus anticoagulant',
        category: 'Haematology',
    },
    {
        name_english: ' Luteinising Hormone',
        category: 'Biochemistry',
    },
    {
        name_english: ' Lyme Disease',
        category: ' Virology',
    },
    {
        name_english: ' Lymph node FNA',
        category: ' Non - Gynaecology Cytology',
    },

    {
        name_english: 'MAG',
        category: ' Immunology'
    },
    {
        name_english: ' Magnesium(Blood and Urine)',
        category: 'Biochemistry',
    },
    {
        name_english: ' Malarial parasites, detection of',
        category: 'Haematology',
    },
    {
        name_english: ' Mannose Binding Lectins',
        category: ' Immunology',
    },
    {
        name_english: ' Manual blood film',
        category: 'Haematology',
    },
    {
        name_english: ' Mast Cell Tryptase',
        category: ' Immunology',
    },
    {
        name_english: ' Measles IgG',
        category: ' Virology',
    },
    {
        name_english: ' Measles IgM',
        category: ' Virology',
    },
    {
        name_english: ' Measles virus PCR',
        category: ' Virology',
    },
    {
        name_english: ' Mediastinal mass FNA',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' Meningococcal DNA detection by PCR (multiplex with Pneumococcal DNA PCR)',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Metadrenalines',
        category: 'Biochemistry',
    },
    {
        name_english: ' Met - haemoglobin',
        category: 'Biochemistry',
    },
    {
        name_english: ' Methotrexate',
        category: 'Biochemistry',
    },
    {
        name_english: 'Mitochondrial antibodies',
        category: ' Immunology',
    },
    {
        name_english: 'MOG',
        category: ' Immunology',
    },
    {
        name_english: ' Mouth swab',
        category: ' Bacteriology',
    },
    {
        name_english: 'MPO',
        category: ' Immunology',
    },
    {
        name_english: ' MRSA',
        category: ' Bacteriology',
    },
    {
        name_english: ' Mucin – Special Stain',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: ' Mumps IgG',
        category: ' Virology',
    },
    {
        name_english: ' Mumps IgM',
        category: ' Virology',
    },
    {
        name_english: ' Muscle Specific Tyrosine Kinase (MUSK)',
        category: ' Immunology',
    },
    {
        name_english: 'MUSK',
        category: ' Immunology',
    },
    {
        name_english: ' Mycobacteria – microscopy/culture',
        category: ' Bacteriology',
    },
    {
        name_english: 'Mycobacterium PCR',
        category: ' Bacteriology',
    },
    {
        name_english: ' Mycoplasma PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Myelin Associated Glycoprotein (MAG)',
        category: ' Immunology',
    },
    {
        name_english: ' Myeloperoxidase (MPO) antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Myositis Antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Naïve Memory and Effector T Cell Subsets',
        category: ' Immunology'
    },
    {
        name_english: ' Neck FNA',
        category: ' Non - Gynaecology Cytology',
    },
    {
        name_english: 'Neisseria meningitidis isolate characterisation',
        category: ' Meningococcal Reference Unit',
    },
    {
        name_english: ' Neisseria meningitidis: Functional antibody to serogroup B by Serum Bactericidal Antibody Assay (SBA)',
        category: ' Vaccine Evaluation Unit',
    },
    {
        name_english: ' Neisseria meningitidis: Functional antibody to serogroups A, C, W and Y by internationally standardised serum bactericidal antibody assays',
        category: ' Vaccine Evaluation Unit',
    },
    {
        name_english: ' Neisseria meningitidis: Minimum inhibitory concentration',
        category: 'Meningococcal Reference Unit'
    },
    {
        name_english: ' Neisseria meningitidis: Serogrouping and outer membrane typing',
        category: ' Meningococcal Reference Unit',
    },
    {
        name_english: ' Neutrophil Function (DHR) Test',
        category: ' Immunology',
    },
    {
        name_english: ' NMDA – N-methyl-D-aspartate receptor antibodies',
        category: ' Immunology',
    },
    {
        name_english: ' Non-specific inflammatory arthropathies',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: ' Non-specific non-inflammatory arthropathies',
        category: ' Synovial Fluid Cytology',
    },
    {
        name_english: 'Norovirus PCR',
        category: ' Molecular Microbiology',
    },
    {
        name_english: ' Nose Swab',
        category: ' Bacteriology',
    },
    {
        name_english: ' NT - proBNP',
        category: 'Biochemistry',
    },

    {
        name_english: 'Oesophageal brushings',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Oestradiol',
        category: 'Biochemistry'
    },
    {
        name_english: 'Oral Anticoagulant Control (INR)',
        category: 'Haematology'
    },
    {
        name_english: 'Orosomucoid',
        category: 'Biochemistry'
    },
    {
        name_english: 'Osmolality (Blood and Urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Osmolar Gap (calculated as: calculated osmolality – measured osmolality. Calculated osmolality is 2 x (Na + K) + glucose + urea)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Osteoarthritis',
        category: 'Synovial Fluid Cytology'
    },
    {
        name_english: 'Ova, Cysts and Parasites',
        category: 'Bacteriology'
    },
    {
        name_english: 'Ovarian cyst FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Ovary antibodies',
        category: 'Immunology'
    },

    {
        name_english: 'P1NP',
        category: 'Biochemistry'
    },
    {
        name_english: 'P3NP',
        category: 'Biochemistry'
    },
    {
        name_english: 'Pancreatic FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Paracetamol',
        category: 'Biochemistry'
    },
    {
        name_english: 'Paraneoplastic Neuronal Antibodies',
        category: 'Immunology'
    },
    {
        name_english: 'Parasites',
        category: 'Bacteriology'
    },
    {
        name_english: 'Paratesticular FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Parathyroid hormone',
        category: 'Biochemistry'
    },
    {
        name_english: 'Parvovirus B19 IgG',
        category: 'Virology',
    },
    {
        name_english: 'Parvovirus B19 IgM',
        category: 'Virology'
    },
    {
        name_english: 'Parvovirus B19 viral load',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Perinatal post mortems',
        category: 'Histopathology'
    },
    {
        name_english: 'Peritoneal fluid',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Peritoneal Fluids',
        category: 'Bacteriology'
    },
    {
        name_english: 'Peritoneal washings',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Pernasal swab(for pertussis) ',
        category: 'Bacteriology'
    },
    {
        name_english: 'pH (blood and urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Phenobarbitone',
        category: 'Biochemistry'
    },
    {
        name_english: 'Phenytoin',
        category: 'Biochemistry'
    },
    {
        name_english: 'Phosphate (blood and urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'PIIINP',
        category: 'Biochemistry'
    },
    {
        name_english: 'PLA2R Antibodies',
        category: 'Immunology'
    },
    {
        name_english: 'Plasma viscosity',
        category: 'Haematology'
    },
    {
        name_english: 'Platelet Glycoprotein Expression',
        category: 'Immunology'
    },
    {
        name_english: 'Platelets Aggregation Studies',
        category: 'Haematology'
    },
    {
        name_english: 'Pleural fluid',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'PLGF',
        category: 'Biochemistry'
    },
    {
        name_english: 'Pneumococcal PCR',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Pneumococcal serotype - specific IgG',
        category: 'Vaccine Evaluation Unit'
    },
    {
        name_english: 'Pneumococcal urinary antigen detection',
        category: 'Virology'
    },
    {
        name_english: 'Pneumocystis jirovecii PCR',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Polyoma viruses(BK)',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Polysaccharide antigen detection',
        category: 'Meningococcal Reference Unit'
    },
    {
        name_english: 'Post Trachelectomy Cytology',
        category: 'Gynaecological Cytology'
    },
    {
        name_english: 'Potassium',
        category: 'Biochemistry'
    },
    {
        name_english: 'PR3 autoantibodies (cANCA)',
        category: 'Immunology'
    },
    {
        name_english: 'Pregnancy test (blood)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Procalcitonin',
        category: 'Biochemistry'
    },
    {
        name_english: 'Procollagen III Peptide',
        category: 'Biochemistry'
    },
    {
        name_english: 'Progesterone',
        category: 'Biochemistry'
    },
    {
        name_english: 'Prolactin',
        category: 'Biochemistry'
    },
    {
        name_english: 'Prostate Specific Antigen',
        category: 'Biochemistry'
    },
    {
        name_english: 'Protein C',
        category: 'Haematology'
    },
    {
        name_english: 'Protein creatinine ratio(urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Protein S',
        category: 'Haematology'
    },
    {
        name_english: 'Prothrombin time',
        category: 'Haematology'
    },
    {
        name_english: 'Prothrombin G20210A Mutation screen',
        category: 'Haematology'
    },
    {
        name_english: 'Pseudogout (pyrophosphate crystals)',
        category: 'Synovial Fluid Cytology'
    },
    {
        name_english: 'PTH',
        category: 'Biochemistry'
    },
    {
        name_english: 'Pus',
        category: 'Bacteriology'
    },
    {
        name_english: 'PVIS',
        category: 'Haematology'
    },

    {
        name_english: 'Q Fever Serology and PCR (referral)',
        category: 'Virology'
    },
    {
        name_english: 'Quiescent gout (urate crystals)',
        category: 'Synovial Fluid Cytology'
    },

    {
        name_english: 'Rapid/routine Carbapenemase-Producing Enterobacteriaceae (CPE) Screen',
        category: 'Bacteriology'
    },
    {
        name_english: 'Reducing substances (faeces only)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Renal FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Renin concentration',
        category: 'Biochemistry'
    },
    {
        name_english: 'Resin embedding/thin sectioning Electron Microscopy',
        category: 'Histopathology'
    },
    {
        name_english: 'Respiratory screen',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Respiratory specimens',
        category: 'Bacteriology'
    },
    {
        name_english: 'Respiratory virus PCR',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Reticulocyte count',
        category: 'Haematology'
    },
    {
        name_english: 'Retroperitoneal mass FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Rheumatoid factor',
        category: 'Immunology'
    },
    {
        name_english: 'Ribosomal',
        category: 'Immunology'
    },
    {
        name_english: 'RIPA',
        category: 'Haematology'
    },
    {
        name_english: 'Ristocetin induced platelet aggregation (RIPA)',
        category: 'Haematology'
    },
    {
        name_english: 'Rotavirus PCR – enteric',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Routine haemoglobinopathy screening',
        category: 'Haematology'
    },
    {
        name_english: 'Rubella Avidity (referral)',
        category: 'Virology'
    },
    {
        name_english: 'Rubella IgG',
        category: 'Virology'
    },
    {
        name_english: 'Rubella IgM',
        category: 'Virology'
    },




    {
        name_english: 'Salicylate',
        category: 'Biochemistry'
    },
    {
        name_english: 'Salivary gland FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Sapovirus PCR – enteric',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Schistosoma haematobium',
        category: 'Bacteriology'
    },
    {
        name_english: 'Selenium',
        category: 'Biochemistry'
    },
    {
        name_english: 'Sero-negative arthropathies',
        category: 'Synovial Fluid Cytology'
    },
    {
        name_english: 'Sero-negative spondylarthropathies',
        category: 'Synovial Fluid Cytology'
    },
    {
        name_english: 'Serum 17-hydroxyprogesterone',
        category: 'Biochemistry'
    },
    {
        name_english: 'Serum ferritin',
        category: 'Haematology'
    },
    {
        name_english: 'Serum folate',
        category: 'Haematology'
    },
    {
        name_english: 'Serum intrinisic factor antibodies',
        category: 'Haematology'
    },
    {
        name_english: 'Serum paraprotein identification/ quantification',
        category: 'Immunology'
    },
    {
        name_english: 'Serum Protein Electrophoresis',
        category: 'Immunology'
    },
    {
        name_english: 'Serum vitamin B12',
        category: 'Haematology'
    },
    {
        name_english: 'SHBG',
        category: 'Biochemistry'
    },
    {
        name_english: 'Sirolimus',
        category: 'Biochemistry'
    },
    {
        name_english: 'Skin antibodies',
        category: 'Immunology'
    },
    {
        name_english: 'Skin, superficial, non- surgical wounds',
        category: 'Bacteriology'
    },
    {
        name_english: 'Smooth muscle antibodies',
        category: 'Immunology'
    },
    {
        name_english: 'Sodium (blood and urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Splenic FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Sputum',
        category: 'Bacteriology'
    },
    {
        name_english: 'Sputum',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'ß2 Microglobulin',
        category: 'Immunology'
    },
    {
        name_english: 'Staphylococcal serology – AST (referral)',
        category: 'Virology'
    },
    {
        name_english: 'Stem cell sterility check',
        category: 'Bacteriology'
    },
    {
        name_english: 'Sterile fluids',
        category: 'Bacteriology'
    },
    {
        name_english: 'Stool for Sugar chromatography(paediatric only)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Streptococcal serology (including anti-DNaseB)',
        category: 'Virology'
    },
    {
        name_english: 'Streptococcus pneumoniae serology',
        category: 'Vaccine Evaluation Unit'
    },
    {
        name_english: 'Subcutaneous mass FNA',
        category: 'Non-Gynaecology Cytology'
    },
    {
        name_english: 'Sweat tests',
        category: 'Biochemistry'
    },
    {
        name_english: 'Syphilis antibody',
        category: 'Virology'
    },
    {
        name_english: 'Syphilis confirmation including Immunoblot',
        category: 'Virology'
    },
    {
        name_english: 'Syphilis IgM',
        category: 'Virology'
    },

    {
        name_english: 'T Cell Activation Panel',
        category: 'Immunology'

    },
    {
        name_english: 'T&amp;B Lymphocyte Subsets',
        category: 'Immunology'
    },
    {
        name_english: 'Tacrolimus (FK506, prograf)',
        category: 'Biochemistry'

    },
    {
        name_english: 'TB examination (microscopy)',
        category: 'Bacteriology'
    },
    {
        name_english: 'TB Gamma Interferon Release Assay (Quantiferon)',
        category: 'Immunology'

    },
    {
        name_english: 'Testicular FNA',
        category: 'Non-Gynaecology Cytology'

    },
    {
        name_english: 'Testis antibodies',
        category: 'Immunology'

    },
    {
        name_english: 'Testosterone',
        category: 'Biochemistry'

    },
    {
        name_english: 'Tetanus antibodies',
        category: 'Vaccine Evaluation Unit'

    },
    {
        name_english: 'Theophylline',
        category: 'Biochemistry'

    },
    {
        name_english: 'Therapeutic Drug Monitoring of anti-TNF therapies Infliximab and Adalimumab',
        category: 'Immunology'

    },
    {
        name_english: 'Thiopental',
        category: 'Biochemistry'

    },
    {
        name_english: 'Thiopurine metabolites',
        category: 'Biochemistry'

    },
    {
        name_english: 'Thiopurine Methyltransferase (TPMT)',
        category: 'Biochemistry'

    },
    {
        name_english: 'Throat Swab',
        category: 'Bacteriology'

    },
    {
        name_english: 'Thyroid FNA',
        category: 'Non-Gynaecology Cytology'

    },
    {
        name_english: 'Thyroid peroxidase (TPO) antibodies',
        category: 'Biochemistry'
    },
    {
        name_english: 'Thyroid Stimulating Hormone',
        category: 'Biochemistry'
    },
    {
        name_english: 'Tips',
        category: 'Bacteriology'
    },
    {
        name_english: 'Tissue and biopsies',
        category: 'Bacteriology'

    },
    {
        name_english: 'Tobramycin',
        category: 'Biochemistry'

    },
    {
        name_english: 'Total Protein',
        category: 'Biochemistry'
    },
    {
        name_english: 'Toxoplasma PCR',
        category: 'Molecular Microbiology'

    },
    {
        name_english: 'Toxoplasma serology (avidity)',
        category: 'Virology'

    },
    {
        name_english: 'Toxoplasma serology (IgG)',
        category: 'Virology'

    },
    {
        name_english: 'Toxoplasma serology (IgM)',
        category: 'Virology'

    },
    {
        name_english: 'TPO',
        category: 'Biochemistry'
    },
    {
        name_english: 'Transferrin (and saturation)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Treponema pallidum (syphilis) PCR',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Treponema pallidum confirmation',
        category: 'Virology'
    },
    {
        name_english: 'Treponema pallidum screen',
        category: 'Virology'
    },
    {
        name_english: 'Triglycerides',
        category: 'Biochemistry'

    },
    {
        name_english: 'Triiodothyronine (free T3)',
        category: 'Biochemistry'

    },
    {
        name_english: 'Troponin T',
        category: 'Biochemistry'

    },
    {
        name_english: 'TSH',
        category: 'Biochemistry'
    },
    {
        name_english: 'TSH Receptor Antibodies',
        category: 'Immunology'

    },
    {
        name_english: 'Type I Procollagen N terminal Peptide',
        category: 'Biochemistry'
    },


    {
        name_english: 'Universal Antenatal Haemoglobinopathy Screening',
        category: 'Haematology'
    },
    {
        name_english: 'Urate (blood and urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Urea (blood and urine)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Ureteric washing',
        category: 'Non - Gynaecology Cytology'
    },
    {
        name_english: 'Urethral washing',
        category: 'Non - Gynaecology Cytology'
    },
    {
        name_english: 'Urine (voided, catheterised, instrumented or from ileal conduit)',
        category: 'Non - Gynaecology Cytology'
    },
    {
        name_english: 'Urine Culture',
        category: 'Bacteriology'
    },
    {
        name_english: 'Urines',
        category: 'Bacteriology'
    },

    {
        name_english: 'Valproate',
        category: 'Biochemistry'
    },
    {
        name_english: 'Vancomycin',
        category: 'Biochemistry'
    },
    {
        name_english: 'Varicella Zoster IgG',
        category: 'Virology'
    },
    {
        name_english: 'Varicella Zoster IgM',
        category: 'Virology'
    },
    {
        name_english: 'Varicella-zoster virus PCR',
        category: 'Molecular Microbiology'
    },
    {
        name_english: 'Vault Cytology',
        category: 'Gynaecological Cytology'
    },
    {
        name_english: 'Vitamin A (retinol)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Vitamin B12',
        category: 'Biochemistry'
    },
    {
        name_english: 'Vitamin D',
        category: 'Biochemistry'
    },
    {
        name_english: 'Vitamin E (Tocopherol)',
        category: 'Biochemistry'
    },
    {
        name_english: 'Voltage-Gated Calcium Channel Antibodies',
        category: 'Immunology'
    },
    {
        name_english: 'Voltage-Gated Potassium Channel Antibodies',
        category: 'Immunology'
    },
    {
        name_english: 'VRE screening',
        category: 'Bacteriology'
    },
    {
        name_english: 'Vulval Cytology',
        category: 'Gynaecological Cytology'
    },

    {
        name_english: 'Wear and/or loosening of prosthetic joints',
        category: 'Synovial Fluid Cytology'
    },
    {
        name_english: 'Wounds – Skin, Superficial, Non-surgical',
        category: 'Bacteriology'
    },

    {
        name_english: 'Xanthochromia Screen (CSF)',
        category: 'Biochemistry'
    },

    {
        name_english: 'Zinc',
        category: 'Biochemistry'
    },
    {
        name_english: 'Zinc Transporter 8 (ZnT8) antibodies',
        category: 'Immunology'
    }

]
data.forEach((one) => {
    axios.post('http://localhost:3000/api/analysis', one)
})