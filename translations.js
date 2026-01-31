// Language Translation Data
const translations = {
    en: {
        nav: {
            home: 'Home',
            report: 'Report Issue',
            map: 'Live Map',
            myreports: 'My Reports',
            authority: 'Authority'
        },
        report: {
            title: 'Report a Wetland Violation',
            subtitle: 'Help protect our wetlands. Share details about the violation you\'ve witnessed.',
            step1: 'Issue Type',
            step2: 'Details',
            step3: 'Location & Contact',
            issuetype: 'Issue Type',
            dumping: 'Illegal Dumping',
            dumpingdesc: 'Waste disposal in wetlands',
            sewage: 'Sewage Discharge',
            sewagedesc: 'Untreated water discharge',
            construction: 'Illegal Construction',
            constructiondesc: 'Unauthorized building activity',
            description: 'Description',
            descriptionhint: 'Provide as much detail as possible to help us understand the issue',
            photo: 'Upload Photo',
            dragdrop: 'Drag & drop your images here or click to browse',
            photoinfo: 'Max 5MB each | JPG, PNG, WebP',
            location: 'Location',
            autodetect: 'Auto-Detect',
            locationhint: 'Accurate location helps authorities respond quickly',
            contact: 'Contact Information',
            name: 'Your Name',
            namehint: 'We can follow up with you',
            email: 'Email',
            emailhint: 'To receive status updates',
            phone: 'Phone',
            phonehint: 'For urgent communication',
            optional: '(Optional)',
            notice: 'Important:',
            noticetext: 'Please ensure all information is accurate. False reports may have legal consequences.',
            submit: 'Submit Report',
            success: 'Report Submitted Successfully!',
            successtext: 'Thank you for helping protect our wetlands. Your report has been recorded and will be reviewed by authorities.',
            refnumber: 'Reference Number:',
            submitted: 'Submitted at:',
            another: 'Submit Another Report',
            camera: 'Live Camera',
            capture: 'Capture Photo',
            close: 'Close Camera'
        },
        hero: {
            title: 'Protect Wetlands. Report Violations. Track Action.',
            subtitle: 'Empower your community to safeguard wetlands. Report illegal dumping, sewage discharge, and unauthorized construction in real-time.',
            reportbtn: 'Report an Issue',
            mapbtn: 'View Live Map',
            scroll: 'Scroll to explore'
        },
        info: {
            title: 'Why WetlandGuard?',
            card1title: 'Real-Time Reporting',
            card1desc: 'Report wetland violations instantly with photos and location data',
            card2title: 'Live Map Tracking',
            card2desc: 'View reported violations on an interactive map with color-coded categories',
            card3title: 'Progress Tracking',
            card3desc: 'Monitor action status from report to resolution',
            card4title: 'Community Power',
            card4desc: 'Strengthen environmental protection through collective action'
        },
        map: {
            title: 'Live Violation Map',
            subtitle: 'Interactive map showing reported wetland violations across the region',
            legend: 'Report Categories',
            dumping: 'Illegal Dumping',
            sewage: 'Sewage Discharge',
            construction: 'Illegal Construction'
        },
        citizen: {
            title: 'My Reports',
            totalreports: 'Total Reports',
            underreview: 'Under Review',
            actiontaken: 'Action Taken',
            resolved: 'Resolved',
            allreports: 'All Reports',
            reported: 'Reported',
            review: 'Under Review',
            action: 'Action Taken',
            resolved: 'Resolved'
        },
        authority: {
            title: 'Authority Control Center',
            adminaccess: 'ADMIN ACCESS',
            export: 'Export',
            analytics: 'Analytics Dashboard',
            totalreports: 'Total Reports',
            pendingreview: 'Pending Review',
            inprogress: 'In Progress',
            resolved: 'Resolved',
            violations: 'Violations by Category',
            managereports: 'Manage Reports',
            status: 'Status',
            type: 'Violation Type',
            priority: 'Priority',
            search: 'Search by ID, location, reporter...',
            selectall: 'Select All',
            bulkupdate: 'Bulk Update Status',
            assignteam: 'Assign to Team',
            allreports: 'All Reports',
            reports: 'reports',
            id: 'ID',
            reporter: 'Reporter',
            submitted: 'Submitted',
            action: 'Actions'
        },
        footer: {
            title: 'WetlandGuard',
            desc: 'Protecting wetlands through community action.',
            links: 'Quick Links',
            contact: 'Contact',
            email: 'Email: info@wetlandguard.local',
            phone: 'Phone: (555) 123-GUARD',
            copyright: '© 2026 WetlandGuard. Protecting ecosystems for future generations.'
        },
        general: {
            required: 'required'
        }
    },
    hi: {
        nav: {
            home: 'होम',
            report: 'समस्या रिपोर्ट करें',
            map: 'लाइव मैप',
            myreports: 'मेरी रिपोर्ट',
            authority: 'प्राधिकारी'
        },
        report: {
            title: 'आर्द्रभूमि उल्लंघन की रिपोर्ट करें',
            subtitle: 'हमारी आर्द्रभूमि की रक्षा करने में मदद करें। जिस उल्लंघन को आपने देखा है उसके बारे में विवरण साझा करें।',
            step1: 'समस्या का प्रकार',
            step2: 'विवरण',
            step3: 'स्थान और संपर्क',
            issuetype: 'समस्या का प्रकार',
            dumping: 'अवैध डंपिंग',
            dumpingdesc: 'आर्द्रभूमि में अपशिष्ट निपटान',
            sewage: 'सीवेज निर्वहन',
            sewagedesc: 'अनुपचारित जल निर्वहन',
            construction: 'अवैध निर्माण',
            constructiondesc: 'अनुमति रहित निर्माण गतिविधि',
            description: 'विवरण',
            descriptionhint: 'समस्या को समझने में मदद के लिए जितना संभव हो सके विवरण दें',
            photo: 'फोटो अपलोड करें',
            dragdrop: 'अपनी छवियों को यहां खींचें और ड्रॉप करें या ब्राउज़ करने के लिए क्लिक करें',
            photoinfo: 'प्रत्येक 5MB | JPG, PNG, WebP तक',
            location: 'स्थान',
            autodetect: 'ऑटो-डिटेक्ट',
            locationhint: 'सटीक स्थान प्राधिकारियों को तेजी से जवाब देने में मदद करता है',
            contact: 'संपर्क जानकारी',
            name: 'आपका नाम',
            namehint: 'हम आपके साथ आगे बढ़ सकते हैं',
            email: 'ईमेल',
            emailhint: 'स्थिति अपडेट प्राप्त करने के लिए',
            phone: 'फोन',
            phonehint: 'आपातकालीन संचार के लिए',
            optional: '(वैकल्पिक)',
            notice: 'महत्वपूर्ण:',
            noticetext: 'कृपया सुनिश्चित करें कि सभी जानकारी सटीक है। झूठी रिपोर्ट के कानूनी परिणाम हो सकते हैं।',
            submit: 'रिपोर्ट सबमिट करें',
            success: 'रिपोर्ट सफलतापूर्वक सबमिट की गई!',
            successtext: 'हमारी आर्द्रभूमि की रक्षा करने में मदद के लिए धन्यवाद। आपकी रिपोर्ट दर्ज की गई है और प्राधिकारियों द्वारा समीक्षा की जाएगी।',
            refnumber: 'संदर्भ संख्या:',
            submitted: 'पर सबमिट किया गया:',
            another: 'एक और रिपोर्ट सबमिट करें',
            camera: 'लाइव कैमरा',
            capture: 'फोटो लें',
            close: 'कैमरा बंद करें'
        },
        hero: {
            title: 'आर्द्रभूमि की रक्षा करें। उल्लंघन की रिपोर्ट करें। कार्रवाई को ट्रैक करें।',
            subtitle: 'आर्द्रभूमि की रक्षा के लिए अपने समुदाय को सशक्त बनाएं। अवैध डंपिंग, सीवेज निर्वहन और अनुमति रहित निर्माण की रिपोर्ट करें।',
            reportbtn: 'समस्या रिपोर्ट करें',
            mapbtn: 'लाइव मैप देखें',
            scroll: 'देखने के लिए स्क्रॉल करें'
        },
        info: {
            title: 'WetlandGuard क्यों?',
            card1title: 'रीयल-टाइम रिपोर्टिंग',
            card1desc: 'तस्वीरों और स्थान डेटा के साथ तुरंत आर्द्रभूमि उल्लंघन की रिपोर्ट करें',
            card2title: 'लाइव मैप ट्रैकिंग',
            card2desc: 'इंटरैक्टिव मैप पर रंग-कोडित श्रेणियों के साथ रिपोर्ट की गई उल्लंघन देखें',
            card3title: 'प्रगति ट्रैकिंग',
            card3desc: 'रिपोर्ट से समाधान तक कार्रवाई स्थिति की निगरानी करें',
            card4title: 'सामुदायिक शक्ति',
            card4desc: 'सामूहिक कार्रवाई के माध्यम से पर्यावरणीय संरक्षण को मजबूत करें'
        },
        map: {
            title: 'लाइव उल्लंघन मैप',
            subtitle: 'क्षेत्र भर में रिपोर्ट की गई आर्द्रभूमि उल्लंघन दिखाने वाला इंटरैक्टिव मैप',
            legend: 'रिपोर्ट श्रेणियां',
            dumping: 'अवैध डंपिंग',
            sewage: 'सीवेज निर्वहन',
            construction: 'अवैध निर्माण'
        },
        citizen: {
            title: 'मेरी रिपोर्ट',
            totalreports: 'कुल रिपोर्ट',
            underreview: 'समीक्षा में',
            actiontaken: 'कार्रवाई की गई',
            resolved: 'समाधान हुआ',
            allreports: 'सभी रिपोर्ट',
            reported: 'रिपोर्ट की गई',
            review: 'समीक्षा में',
            action: 'कार्रवाई की गई',
            resolved: 'समाधान हुआ'
        },
        authority: {
            title: 'प्राधिकार नियंत्रण केंद्र',
            adminaccess: 'प्रशासन पहुंच',
            export: 'निर्यात',
            analytics: 'विश्लेषण डैशबोर्ड',
            totalreports: 'कुल रिपोर्ट',
            pendingreview: 'समीक्षा लंबित',
            inprogress: 'प्रगति में',
            resolved: 'समाधान हुआ',
            violations: 'श्रेणी द्वारा उल्लंघन',
            managereports: 'रिपोर्ट प्रबंधित करें',
            status: 'स्थिति',
            type: 'उल्लंघन प्रकार',
            priority: 'प्राथमिकता',
            search: 'आईडी, स्थान, रिपोर्टर द्वारा खोजें...',
            selectall: 'सभी चुनें',
            bulkupdate: 'स्थिति अपडेट करें',
            assignteam: 'टीम को असाइन करें',
            allreports: 'सभी रिपोर्ट',
            reports: 'रिपोर्ट',
            id: 'आईडी',
            reporter: 'रिपोर्टर',
            submitted: 'सबमिट किया गया',
            action: 'कार्रवाई'
        },
        footer: {
            title: 'WetlandGuard',
            desc: 'सामुदायिक कार्रवाई के माध्यम से आर्द्रभूमि की रक्षा करना।',
            links: 'त्वरित लिंक',
            contact: 'संपर्क',
            email: 'ईमेल: info@wetlandguard.local',
            phone: 'फोन: (555) 123-GUARD',
            copyright: '© 2026 WetlandGuard। भविष्य की पीढ़ियों के लिए पारिस्थितिकी तंत्र की रक्षा करना।'
        },
        general: {
            required: 'आवश्यक'
        }
    },
    mr: {
        nav: {
            home: 'होम',
            report: 'समस्या अहवाल करा',
            map: 'लाइव नकाशा',
            myreports: 'माझ्या अहवाल',
            authority: 'अधिकार'
        },
        report: {
            title: 'आर्द्रभूमी उल्लंघनाची अहवाल करा',
            subtitle: 'आमचे आर्द्रभूमी संरक्षित करण्यास मदत करा. आपण पाहिलेल्या उल्लंघनाच्या तपशीलाचा भाग पाड़ा.',
            step1: 'समस्या प्रकार',
            step2: 'तपशील',
            step3: 'स्थान आणि संपर्क',
            issuetype: 'समस्या प्रकार',
            dumping: 'अवैध डंपिंग',
            dumpingdesc: 'आर्द्रभूमीत कचरा विघटन',
            sewage: 'सांडवाणीचा विसर्जन',
            sewagedesc: 'अशुद्ध जल विसर्जन',
            construction: 'अवैध बांधकाम',
            constructiondesc: 'अनुमतीविना बांधकामाची कृती',
            description: 'तपशील',
            descriptionhint: 'समस्या समजण्यास मदत करण्यासाठी शक्य तितका तपशील द्या',
            photo: 'फोटो अपलोड करा',
            dragdrop: 'आपल्या प्रतिमांना येथे ड्रॅग करा आणि सोडा किंवा ब्राउজ करण्यासाठी क्लिक करा',
            photoinfo: 'प्रत्येक 5MB | JPG, PNG, WebP',
            location: 'स्थान',
            autodetect: 'स्वयं-शोध',
            locationhint: 'अचूक स्थान अधिकार्यांना लवकर प्रतिक्रिया देण्यास मदत करते',
            contact: 'संपर्क माहिती',
            name: 'आपले नाव',
            namehint: 'आम्ही आपल्याबरोबर आगे जाऊ शकू शकतो',
            email: 'ईमेल',
            emailhint: 'स्थिती अपडेट मिळविण्यासाठी',
            phone: 'फोन',
            phonehint: 'तातकालीन संप्रेषणासाठी',
            optional: '(पर्यायी)',
            notice: 'महत्वाचे:',
            noticetext: 'कृपया सर्व माहिती अचूक आहे हे सुनिश्चित करा. खोट्या अहवालांचे कायदेशीर परिणाम होऊ शकतात.',
            submit: 'अहवाल सादर करा',
            success: 'अहवाल यशस्वीरीत्या सादर केला गेला!',
            successtext: 'आमच्या आर्द्रभूमीचे संरक्षण करण्यात मदत केल्याबद्दल धन्यवाद. आपला अहवाल रेकॉर्ड केला गेला आहे आणि अधिकार्यांनी तपास केला जाईल.',
            refnumber: 'संदर्भ क्रमांक:',
            submitted: 'येथे सादर केले:',
            another: 'अजून एक अहवाल सादर करा',
            camera: 'लाइव्ह कॅमेरा',
            capture: 'फोटो काढा',
            close: 'कॅमेरा बंद करा'
        },
        hero: {
            title: 'आर्द्रभूमी संरक्षित करा. उल्लंघनाची अहवाल करा. कृती ट्रॅक करा.',
            subtitle: 'आर्द्रभूमी संरक्षण करण्यासाठी आपल्या समुदायाला सशक्त करा. अवैध डंपिंग, सांडवाणीचा विसर्जन आणि अनुमतीविना बांधकामाची अहवाल करा.',
            reportbtn: 'समस्या अहवाल करा',
            mapbtn: 'लाइव नकाशा पाहा',
            scroll: 'पहाण्यासाठी स्क्रोल करा'
        },
        info: {
            title: 'WetlandGuard का?',
            card1title: 'वास्तविक-काळ अहवाल',
            card1desc: 'फोटो आणि स्थान डेटा सह तात्काळ आर्द्रभूमी उल्लंघनाची अहवाल करा',
            card2title: 'लाइव नकाशा ट्रॅकिंग',
            card2desc: 'इंटरेक्टिव नकाशावर रंग-कोडेड श्रेणींसह रिपोर्ट केलेल्या उल्लंघन पहा',
            card3title: 'प्रगती ट्रॅकिंग',
            card3desc: 'अहवाल ते तीरण पर्यंत कृतीची स्थिती निरीक्षण करा',
            card4title: 'समुदाय शक्ती',
            card4desc: 'सामुदायिक कृतीद्वारे पर्यावरणीय संरक्षण मजबूत करा'
        },
        map: {
            title: 'लाइव उल्लंघन नकाशा',
            subtitle: 'क्षेत्र भर में रिपोर्ट की गई आर्द्रभूमी उल्लंघन दिखाने वाला इंटरेक्टिव नकाशा',
            legend: 'अहवाल श्रेणी',
            dumping: 'अवैध डंपिंग',
            sewage: 'सांडवाणीचा विसर्जन',
            construction: 'अवैध बांधकाम'
        },
        citizen: {
            title: 'माझ्या अहवाल',
            totalreports: 'एकूण अहवाल',
            underreview: 'तपासाखाली',
            actiontaken: 'कारवाई केली गई',
            resolved: 'सुलझलेले',
            allreports: 'सर्व अहवाल',
            reported: 'अहवाल केले',
            review: 'तपासाखाली',
            action: 'कारवाई केली गई',
            resolved: 'सुलझलेले'
        },
        authority: {
            title: 'प्राधिकार नियंत्रण केंद्र',
            adminaccess: 'प्रशासन प्रवेश',
            export: 'निर्यात',
            analytics: 'विश्लेषण डैशबोर्ड',
            totalreports: 'एकूण अहवाल',
            pendingreview: 'तपास लंबित',
            inprogress: 'प्रगतीत',
            resolved: 'सुलझलेले',
            violations: 'श्रेणीनुसार उल्लंघन',
            managereports: 'अहवाल व्यवस्थापित करा',
            status: 'स्थिती',
            type: 'उल्लंघन प्रकार',
            priority: 'प्राधान्य',
            search: 'आयडी, स्थान, रिपोर्टर द्वारा शोधा...',
            selectall: 'सर्व निवडा',
            bulkupdate: 'स्थिती अपडेट करा',
            assignteam: 'टीमला नियुक्त करा',
            allreports: 'सर्व अहवाल',
            reports: 'अहवाल',
            id: 'आयडी',
            reporter: 'रिपोर्टर',
            submitted: 'सादर केलेले',
            action: 'कारवाई'
        },
        footer: {
            title: 'WetlandGuard',
            desc: 'सामुदायिक कृतीद्वारे आर्द्रभूमी संरक्षण करा.',
            links: 'द्रुत लिंक',
            contact: 'संपर्क',
            email: 'ईमेल: info@wetlandguard.local',
            phone: 'फोन: (555) 123-GUARD',
            copyright: '© 2026 WetlandGuard. भविष्य पीढ्यांसाठी पारिस्थितिकी संरक्षण करणे.'
        },
        general: {
            required: 'आवश्यक'
        }
    }
};

// Language Switching Function
function initLanguageSwitch() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);

            // Update active button
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Save preference
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);
    document.querySelector(`[data-lang="${savedLang}"]`).classList.add('active');
}

// Set Language Function
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[lang];

        // Navigate through nested keys
        for (let k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                translation = null;
                break;
            }
        }

        if (translation) {
            // Handle input placeholders
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'tel')) {
                element.placeholder = translation;
            }
            // Handle regular elements - set text content
            else {
                element.textContent = translation;
            }
        }
    });

    // Update document language
    document.documentElement.lang = lang;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initLanguageSwitch);
