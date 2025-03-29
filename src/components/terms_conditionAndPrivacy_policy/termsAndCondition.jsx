import { Box, Stack, Typography } from '@mui/material';
import { useLocales } from 'src/locales';

export default function TermsAndCondition() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <Box sx={{ bgcolor: '#E4F6F2', my: 10, p: 5, mx: 30, borderRadius: 3, color: '#1F2C5C' }}>
      <Stack gap={1}>
        {curLangAr ? (
          <Typography variant="h3" sx={{ mt: 4 }}>
            أحكام و شروط الاستخدام (للمستفيد من الخدمات الطبية)
          </Typography>
        ) : (
          <Typography variant="h3" sx={{ mt: 4 }}>
            Policies related to beneficiaries of medical services <br /> (patients and families)
          </Typography>
        )}

        {curLangAr ? (
          <Typography variant="h3" sx={{ mt: 4 }}>
            الرجاء قراءة أحكام و شروط الاستخدام بعناية مع استيعاب كل البنود قبل التوقيع على قبولها و
            قبل استخدام الموقع Hakeemna.com أو التطبيقات المرتبطة بها أو الصفحات ذو علاقة بالمنصة.
          </Typography>
        ) : (
          <Typography paragraph>
            Please read the “Privacy Policy” carefully and understand all the terms before signing
            for acceptance and before using the Hakeemna.com Website or associated applications or
            pages related to the Platform.
          </Typography>
        )}

        {curLangAr ? (
          <Typography variant="h4">تعريف المصطلحات</Typography>
        ) : (
          <Typography variant="h4" mb={2}>
            Definition of terms:
          </Typography>
        )}

        <Typography paragraph>
          {curLangAr
            ? `الطرف الأول هو منصة حكيمنا. كوم . عندما يتم ذكر مصطلح "المنصة" أو "حكيمنا.كوم" أو "نظام" في هذا المستند فإنه يشمل المنصة الالكترونية، التطبيقات على اندرويد أو نظام تشغيل ابل "اي او اس"، المواقع الالكترونية ذو علاقة مع المنصة، المدراء و الموظفين العاملين في المنصة.`
            : `The first party is "Hakeemna.com" platform. When the term "Platform", "Hakeemna.com", "Hakeemna.com platform" or "System" is mentioned in this document, it includes Platform, applications on Android or IOS, websites related to the Platform, managers and employees working on the Platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `الطرف الثاني هو المستخدم والمستفيد من الخدمات الطبية المقدمة من الممارسين لمهنة الطب و الموردين للخدمات ذات علاقة بالقطاع الصحي، حيث أن مصطلح المستخدم أو المستفيد يشمل المريض وعائلته التي تستخدم المنصة، أو متصفح زائر للمنصة.`
            : `The second party is the user and beneficiary of the medical services provided by medical practitioners and suppliers of services related to the health sector, where the term “user” or “beneficiary” includes the patient and his family that use the platform, or a browser visiting the platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `الطرف الثالث هو مزود خدمة طبية، مثل ممارس مهنة الطب مثل عيادة، مركز صحي، مركز أشعة، طبيب نفسي، أو مؤسسة مستلزمات طبية وغيرهم ممن يقومون بتزويد خدمات لها علاقة بالقطاع الصحي للطرف الثاني، أي أن الطرف الثالث هو أي شخص طبيعي أو اعتباري و مرخص له حسب القانون في بلد إقامته في العمل بشكل مباشر أو غير مباشر في القطاع الصحي.`
            : `The third party is a medical service provider, such as a medical practitioner in a clinic, health care center, radiology center, psychiatrist, or medical supplies institution and others who provide services related to the health care sector to the second party. This third party is any natural or legal person licensed by law in his country of residence to work directly or indirectly in the health sector`}
        </Typography>

        {curLangAr ? (
          <Typography variant="h4">سياسات الخصوصية</Typography>
        ) : (
          <Typography variant="h4">Privacy Policy</Typography>
        )}

        <Typography paragraph>
          {curLangAr
            ? `إدارة منصة حكيمنا تقدر أهمية المحافظة على خصوصية وسرية معلومات المستخدمين الباحثين عن الخدمات الطبية، لذلك عندما يقوم المستخدم بإدخال معلوماته في المنصة فإنه يوجد آليات وقوانين للحفاظ على تلك الخصوصية`
            : `Hakeemna.com appreciates the importance of maintaining the privacy and confidentiality of the information of users looking for medical services, so when the user enters his information into the platform, there are mechanisms and laws to maintain that privacy.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `يتناول هذا القسم سياسة و أحكام استخدامك لموقع حكيمنا و أي خدمات وتطبيقات ذات صلة، بما في ذلك التعليم والتدريب الخاص بالمنصة، وينطبق ذلك ايضا على أي معلومات يتم جمعها عنك بما في ذلك عند حضور فعاليات تخص المنصة. قد نقدم أيضًا إشعارات حول سياسات خصوصية مختلفة أو إضافية فيما يتعلق ببعض الأنشطة والبرامج والعروض، بما في ذلك إشعارات إضافية "في الوقت المناسب" والتي قد تكمل أو توضح ممارسات الخصوصية لدينا أو تزودك بخيارات إضافية فيما يتعلق بمعلوماتك الشخصية.`
            : `This section deals with the policy and terms of your use of Hakeemna.com website and any related services and applications, and this also applies to any information collected about you, including when attending events related to the platform. We may also provide notices about different or additional privacy policies in relation to certain activities, programs and offers, including additional "timely" notices that may supplement or clarify our privacy practices or provide you with additional choices regarding your personal information.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `في القسم التالي نقوم بتوضيح سياسات الخصوصية`
            : `In the following section, we explain our Privacy Policies:`}
        </Typography>

        <Typography variant="h4">
          {curLangAr
            ? 'أولا: المعلومات التي تخزن في المنصة:'
            : 'First, the information that is stored on the platform:'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `أ) معلومات يقوم المستخدم (الطرف الثاني) في تخزينها في المنصة`
            : `a) Information that the user (second party) enters the platform:`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `معلومات عامة عن المستخدم (مثل المريض) وهي إلزامية عند التسجيل لأول مرة، مثل: الاسم الثلاثي، الرقم الوطني تاريخ الميلاد، رقم الهاتف، البريد الالكتروني، الجنسية، و مقر الإقامة.`
            : `General information about the user and it is mandatory when you are registering for the first time, such as: full name, national ID number, date of birth, phone number, email, nationality, and place of residence.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `معلومات إضافية عامة (غير إلزامية) مثل: الطول، الوزن، ممارسة الرياضة ، الامراض المزمنة و صورة شخصية.`
            : `Additional general information (not mandatory) such as: height, weight, exercise and personal photo.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `شركة التأمين المتعاقد معها، معلومات أفراد الأسرة في حال كنت ولي أمرهم وقمت بربط بشكل صحيح حسابهم الشخصي مع حسابك، و معلومات طبية غير الزامية مثل: الأمراض المزمنة، التاريخ المرضي، الأدوية التي يتناولها، تقارير ومستندات طبية مختلفة.`
            : `The contracted insurance company, information about family members (in the case that you want to add them, and you have linked successfully their personal account with your personal account), and non-mandatory medical information such as: chronic diseases, medical history, medications, various medical reports and documents.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `المستخدم مسؤول بشكل قانوني عن صحة البيانات التي يقوم بإدخالها في النظام ويتحمل التبعات القانونية في حال قام بإدخال بيانات غير صحيحة أو بعمل حركات مزيفة للتأثير على المنصة أو على بقية المستخدمين للمنصة، سواء كان ذلك المستخدم هو مستفيد من الخدمات أو مزود لتلك الخدمات الطبية.`
            : `The user is legally responsible for the correctness of the data he enters in the system and bears the legal consequences if he enters incorrect data or makes false movements to influence the platform or the other users of the platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `ب) معلومات يتم إدخالها من أطراف أخرى (مثل الأطباء) ولها علاقة بالمستخدم للخدمات الطبية و أفراد عائلته، مثل المعلومات الطبية، الوصفات الطبية، إجازات مرضية،.`
            : `b) Information entered by third parties (such as doctors) related to the user of the medical services and members of his family, such as medical information, prescriptions, and sick leave.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `ج) معلومات يتم جمعها من خلال الاستبيانات في حال استدعى ذلك الحصول على المعلومات التعريفية حول المستخدم للمنصة، مع العلم أن المشاركة في الاستبيانات هو اختياري وليس الزامي.`
            : `c) Information collected through questionnaires if this requires identifying yourself, knowing that answering surveys is optional and not mandatory.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `د) معلومات حول العنوان "اي بي" التي تستخدمها في حال قمت بفتح حساب جديد.`
            : `d) Information about your IP Address in case you create a new account.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr
            ? 'ثانياً: كيفية استخدام المعلومات التي يقوم المستخدم "الطرف الثاني" بتخزينها في المنصة:'
            : 'Second: How to use the information that the "second party" stores on the platform:'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `البيانات التي قمت أنت بإدخالها و تخزينها تستخدم بهدف تزويدك بالخدمات المختلفة التي تقدمها منصة حكيمنا مثل حجز مواعيد، تقارير طبية، التاريخ المرضي، التواصل مع الأطباء و الموردين.`
            : `The data that you have entered and stored is used to provide you with various services provided by Hakeemna.com platform, such as booking appointments, medical reports, medical history, communicating with doctors and suppliers.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `عند إدخالك للبيانات و تخزينها في منصة حكيمنا فإنك توافق على استخدام تلك البيانات للغايات والخدمات التي تقدمها المنصة.`
            : `When you enter and store data on the Hakeemna.com platform, you agree to use that data for the purposes and services provided by the platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `عند إدخال بيانات التواصل مثل رقم الهاتف والبريد الإلكتروني فإنك توافق على استلام اشعارات ورسائل بريد إلكتروني من منصة حكيمنا كذلك تستطيع الغاءها (الاشعارات واستلام الرسائل الإلكترونية) بشكل جزئي حسب مضمون الاشعار أو الرسالة.`
            : `When entering contact data such as phone number and e-mail, you agree to receive notifications and e-mails from the Hakeemna.com platform, and you can also cancel this option (notifications and receiving e-mails) partially according to the content of the notification or message.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `منصة حكيمنا لها الأحقية بحذف أي بيانات يقوم المستخدم بإدخالها على المنصة قد تعتبر جريمة ضمن قانون الجرائم الالكترونية أو قد تنتهك حقوق ملكية شخص معنوي أو اعتباري أو حقوق منصتنا، لذلك للمنصة الحق بمتابعة ومراقبة المحتوى الذي يقوم بنشره جميع الأطراف المستخدمة للمنصة (الطرف الثاني والطرف الثالث)، مع العلم أن هذه المتابعة والمراقبة غير إلزامي عملها بشكل دوري.`
            : `Hakeemna.com platform has the right to delete any data that the user enters on the platform that may be considered a crime within the Cybercrime Law or may violate the property rights of a person or the rights of our platform. The platform has the right to follow up and monitor the content published by all types of users that use the platform (the second party and the third party), knowing that this follow-up and monitoring process is not mandatory to do periodically.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `في حال قام المستخدم بإغلاق حسابه في المنصة، فإنه يحق لمنصة حكيمنا الاحتفاظ بالبيانات لغايات حفظ السجلات والمعلومات التاريخية والأرشفة. كذلك وبعد الحفاظ على سرية المستخدم وخصوصيته، يحق للمنصة الاستفادة والانتفاع من تلك البيانات لغاية الدراسات والبحث العلمي أو لأي أهداف أخرى.`
            : `If the user deletes his account on the platform, Hakeemna.com platform has the right to retain data for the purposes of keeping records, historical information and archiving. Also, after maintaining the user's confidentiality and privacy, the platform has the right to benefit from that data for the purpose of studies and scientific research or for any other purposes.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr
            ? 'ثالثاً: ملكية البيانات وحمايتها'
            : 'Third: Data ownership and data protection'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `المعلومات التي قمت بتخزينها وملفك الطبي المتاح في صفحتك الشخصية على المنصة هي من الممتلكات الخاصة بك، تستطيع مشاركة تلك المعلومات مع أي مزود للخدمات الطبية في بلدك أو في أي بلد آخر.`
            : `The information you have stored and your medical file available on your personal page on the platform is your property, you can share that information with any medical service provider in your country or in any other country.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `تستطيع حذف حسابك من المنصة وسحب نسخة من البيانات التي هي ملكيتك مع الاخذ بعين الاعتبار البند التالي و التفاصيل الملحقة فيها:`
            : `You can delete your account from the platform and withdraw a copy of the data that is your property, considering the following clause:`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `عند موافقتك على سياسة الخصوصية الخاصة بمنصة حكيمنا فإنك توافق علــى:`
            : `When you agree to the “Privacy Policy” of Hakeemna.com platform, you agree and accept:`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `في حال قمت بأخذ موعد لدى مزود خدمة طبي، فإنك موافق على أن نقوم بمشاركة معلوماتك لمزود الخدمة الطبي الذي اخذت موعد عنده في منصتنا وبمقدار التي تستدعي حالتك.`
            : `If you make an appointment with a medical service provider, you know and agree that we may share your information with the medical service provider you made an appointment with on our platform based on your case necessity.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `جزء من بياناتك الطبية المخزنة في منصة حكيمنا قد تكون مؤرشفة في السجلات الالكترونية لدى الطرف الثالث (مزودي الخدمة الطبية مثل عيادة طبية أو مركز صحي) وقد لا يكون عندك صلاحيات لتصفحها، في حال رغبت بالحصول على نسخة منها فعليك طلب منهم تزويدك بنسخة من تلك البيانات وليس من منصة حكيمنا، مع العلم أن تخزين تلك البيانات، تنظيمها وحمايتها هي من مسؤولية الطرف الثالث (الممارسين ومزودي الخدمة الطبية) وليست من مسؤولية منصة حكيمنا.`
            : `Part of your medical data stored in Hakeemna.com platform may be archived in the electronic records of the third party (medical service providers such as a medical clinic or health center) and you may not have permissions to browse it. If you want to obtain a copy of it, you must require that information from them and not from Hakeemna.com platform. You should know that storing, organizing and protecting that data is the responsibility of the third party (practitioners and medical service providers) and not the responsibility of Hakeemna.com platform.`}
        </Typography>
        <Typography paragraph>
          {curLangAr
            ? `فيما يخص البيانات والمعلومات المخزنة لدى الطرف الثالث (مزودي الخدمات الطبية، مثلاً عيادة) في منصة حكيمنا، قد يكون لديهم سياسات وقوانين خصوصية مختلفة عن منصة منصة حكيمنا، وبالتالي فإن مشاركة معلوماتهم مع المستخدم (الطرف الثاني) تخضع لقوانين الدولة التي يعمل فيها مزود الخدمة الطبية مع الأخذ بعين الاعتبار قوانينه الخاصة المتعلقة بالخصوصية.`
            : `With regard to the data and information stored by the third party (medical service providers, for example, a clinic) in Hakeemna.com platform, they may have different privacy policies and internal regulations than Hakeemna.com platform, and therefore the sharing of their information with the user (the second party) is subject to the laws of the country in which the medical service provider operates, taking into account its own privacy regulation.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `جزء من بياناتك الطبية المخزنة في منصة حكيمنا قد تكون مؤرشفة في السجلات الالكترونية لدى الطرف الثالث (مزودي الخدمة الطبية مثل عيادة طبية أو مركز صحي) وهي من ملكية ذلك الطرف وليست من ملكيتك، في حال قمت بحذف حسابك من منصة حكيمنا فان تلك المعلومات سوف تبقى مخزنة في السجلات التاريخية الطبية لتلك المؤسسة الطبية. في حال رغبتك بحذف معلوماتك من تلك المؤسسة الطبية، عليك التوصل مع تلك المؤسسة وطلب منهم حذف معلوماتك. هذه العملية، التواصل بينكم، التأكد من حذف المعلومات ليست من مسؤولية منصة حكيمنا.`
            : `Part of your medical data stored on Hakeemna.com platform may be archived in the electronic records of third party (for example: medical clinic) and is owned by that party (medical clinic) and not yours, if you delete your account from Hakeemna.com platform, that information will remain stored in the medical historical archive of that medical institution. If you want to delete your information from that medical institution records, you must contact that institution and ask them to delete your information. This process (communication between you and the medical institution and ensuring the information is deleted) is not the responsibility of Hakeemna.com platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `البيانات الشخصية المشمولة بسياسة الخصوصية وتقوم انت بالكشف عنها بشكل طوعي عن طريق نشرها في المنصة تصبح متاحة للجميع. يرجى العلم أنه في حالة قمت بحذف تلك المعلومات فقد يوجد نسخة منها في البيانات المؤرشفة لدينا كبيانات احتياطية في المنصة. كذلك الحال عندما تقوم بمشاركة بيانات تتصف بالخصوصية مع أطراف أخرى، فإنه ينعدم عنها صفة الخصوصية ويتحمل الفاعل المسؤولية والمخاطر الناجمة عن تلك المشاركة.`
            : `Personal data covered by the “Privacy Policy” and voluntarily disclosed by you by posting it on the Platform becomes publicly available. Please note that if you delete this information, there may be a copy of it in our archived data as backup data on the platform. Similarly, when you share private data with third parties, it is no longer considered private, and the actor assumes responsibility and risks arising from such sharing.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `في حال تطلب القانون او أي اجراء قضائي الكشف عن المعلومات الشخصية للمستخدم أو معلومات أخرى عنه، فإن منصة حكيمنا ملزمة بتطبيق القانون وتزويدهم بكل المعلومات المطلوبة لتحقيق العدالة.`
            : `If the law or any judicial procedure requires the disclosure of the user’s personal information or other information about him, Hakeemna.com platform is obligated to apply the law and provide them with all the information required to achieve justice.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr
            ? 'رابعاً: حماية البيانات، الاختراق الإلكتروني ومخاطر أخرى'
            : 'Fourth: Data protection, electronic intrusion, and other risks'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `إن أمان معلوماتك أمر مهم بالنسبة لنا، لذلك يجب معرفة أنه يتم الاحتفاظ بالمعلومات الشخصية على خوادم خارج مقر إدارة ومنصة حكيمنا (المملكة الأردنية الهاشمية)، وقد يتم الاستعانة بخدمات تخزين البيانات في شركات لها خوادم خارج الأردن، وبالتالي فإن عند موافقتك على سياسة الخصوصية فأنت على علم وتوافق على التالي:`
            : `The security of your information is important to us, so you should know that personal information is kept on servers outside the headquarters of Hakeemna.com administration (the Hashemite Kingdom of Jordan), and data storage services may be stored in companies with servers outside Jordan, and therefore when you agree to the privacy policy, you are aware and agree to the following:`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `منصة حكيمنا تعمل على جمع البيانات وتخزينها ومعالجتها في خوادم خارجية، لذلك تقوم المنصة بتطبيق قواعد أمنية لحماية المعلومات ضد الدخول غير مرخص له، لكن وبحكم وجود أخطار متعددة فإننا ملتزمون باتخاذ كل الاجراءات الممكنة لمنع الاختراقات لكن لا نتعهد بأي شكل من الأشكال منع الاختراقات ومنع القرصنة وسرقة البيانات.`
            : `Hakeemna.com platform works to collect, store and process data in external servers, so the platform applies security rules to protect information against unauthorized access, but due to the presence of multiple risks, we are committed to taking all possible measures to prevent intrusions, but we do not undertake in any way to prevent intrusions and prevent hacking and data theft.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `ذا قدمت معلومات شخصية إلينا، فقد تتم معالجة معلوماتك الشخصية في بلد أجنبي، حيث قد تكون قوانين الخصوصية أقل صرامة. من خلال تقديم معلوماتك الشخصية إلينا، فإنك توافق على نقل معلوماتك الشخصية وتخزينها ومعالجتها في بلد آخر غير مقر إدارة منصة حكيمنا وفي بلد غير مكان إقامتك.`
            : `If you provide personal information to us, your personal information may be processed in a foreign country, where privacy laws may be less stringent. By submitting your personal information to us, you consent to the transfer, storage and processing of your personal information in a country other than Hakeemna.com’s platform is located and, in a country, other than your place of residence.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `المستخدم مسؤول عن حماية كلمة السر الخاصة به للدخول الى النظام، كذلك مسؤول عن حفظ نسخة احتياطية من بياناته ومعلوماته المخزنة في المنصة، مع العلم أن تخزين نسخة احتياطية عن بياناتك ليست من مسؤولية منصة حكيمنا.`
            : `The user is responsible for protecting his password to access the system, as well as responsible for saving a backup copy of his data and information stored in the platform, knowing that storing a backup copy of your data is not the responsibility of the platform Hakeemna.com.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `لن تتحمل منصة حكيمنا مسؤولية التعويض بأي شكل من الأشكال عن الأضرار التي قد تنجم من استخدام للموقع أو أحد الخدمات المرتبطة به أو فقدان للبيانات، ومنه فإن المنصة ليست مسؤولة قانونياً ولا مالياً عن الأضرار الناجمة عن:`
            : `Hakeemna.com platform will not be responsible for compensating in any way for damage that may result from the use of the platform or one of its related services or apps, or loss of data. The platform is not legally or financially responsible for damages resulting from:`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `سوء الاستخدام الناتج من الطرف الثاني (المستخدمين للمنصة) وما يترتب عليه من أضرار، كذلك لا تتحمل الأضرار الناجمة عن سوء استخدام الطرف الثالث للمنصة أو أي تطبيق له علاقة معنا.`
            : `Misuse resulting from the second party (users of the platform) and the resulting damage, as well as the inability to bear the damage resulting from the misuse of third party on the platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `الحملات الترويجية التي يقوم الموردون في نفس المنصة والنتيجة المترتبة عليها،`
            : `Promotional campaigns carried out by suppliers on the same platform and their consequence.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `معلومات قام بنشرها مستخدمين (الطرف الثاني) على المنصة وليست صحيحة أو على مواقع أخرى، كذلك الحال بالنسبة للطرف الثالث.`
            : `Incorrect Information published by users (the second and third party) on the platform or on other.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `المنصة ليست مسؤولة عن الأخطاء الطبية أو غيرها من الأضرار المباشرة او غير مباشرة من مزودي الخدمات الطبية أو من أي طرف ثالث. كذلك الحال بالنسبة لما يتم نشره من معلومات على المنصة أو تطبيق له علاقة بالمنصة، فإننا لسنا مسؤولون عما يتم نشره من قبل الطرف الثاني أو الثالث.`
            : `The platform is not responsible for medical errors or other direct or indirect damage consequently from medical service providers or from any third party. Similarly, for direct or indirect damage resulting from information published on the platform or an application related to the platform, we are not responsible for what is published by the second or third party.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `في حال حدوث اختراق أمني وتم اكتشافه والسيطرة عليه، فإنه سوف يتم إشعار كل من تم اختراق بياناته الشخصية بواسطة طريقة التواصل المخزنة في النظام.`
            : `In the case of a security breach being detected and controlled, everyone whose personal data has been compromised will be notified by the communication method stored by the user in the system.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `على المستخدم ابلاغ ادارة منصة حكيمنا عن أي حالة او محاولة سرقة لهويته أو معلومات الدخول الخاصة به في المنصة.`
            : `The user must inform the administration of the Hakeemna.com platform about any case or attempt to steal his identity or login information on the platform.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `لأغراض أمنية، قد نطلب منك معلومات إضافية للتحقق من هويتك حتى نتمكن من معالجة بعض الطلبات. في مثل هذه الحالات، قد نتصل بك عبر البريد الإلكتروني أو بأي وسيلة أخرى متاحة للتحقق من هويتك.`
            : `For security purposes, we may ask you for additional information to verify your identity so that we can process certain requests. In such cases, we may contact you via email or by any other available methods to verify your identity.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `خصوصية الأطفال: المنصة ليست مخصصة للأطفال والمراهقين الذين تقل أعمارهم عن 18 عامًا. نحن لا نجمع معلومات شخصية عن عمد عن الذين تقل أعمارهم عن 18 عامًا دون موافقة الوالدين. إذا علمنا أن طفلاً/ مراهق يقل عمره عن 18 عامًا قد زودنا بمعلومات شخصية من خلال موقعنا وبدون موافقة ولي الأمر فسنقوم بحذف المعلومات من سجلاتنا.`
            : `Children's Privacy: The platform is not intended for children and adolescents under the age of 18. We do not collect personal information about people under the age of 18 without parental consent. If we become aware that a child/adolescent under the age of 18 has provided us with personal information through our platform and without parental consent, we will delete the information from our records.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr
            ? 'خامساً: استخدام البيانات والانتفاع منها'
            : 'Fifth: Use and benefit from data'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `البيانات التي يتم تخزينها في المنصة يتم استخدامها للغايات التالية:`
            : `The data that is stored in the platform is used for the following purposes:`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `التواصل معك. إذا اتصلت بنا عبر الموقع، سنستخدم المعلومات الشخصية التي تقدمها للرد عليك. قد نستخدم أيضًا المعلومات الشخصية للتواصل معك لأغراض أخرى، مثل مشاركة التحديثات حول منتجاتنا وخدماتنا أو تقديم العروض ذات الصلة من شركاء خارجيين.`
            : `Communicate with you. If you contact us via the platform, we will use the personal information you provide to respond to you. We may also use personal information to communicate with you for other purposes, such as sharing updates about our products and services or providing relevant offers from third-party partners.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? ` التحليلات والتخصيص . نحن نستخدم المعلومات الشخصية لإجراء الأبحاث والتحليلات، بما في ذلك تحسين موقعنا؛ لفهم كيفية تفاعلك مع موقعنا والإعلانات والاتصالات معك لتحديد أي من منتجاتنا أو خدماتنا هي الأكثر شعبية، لتحسين موقع منصتنا وحملاتنا التسويقية؛ لتخصيص تجربتك؛ لتوفير الوقت عند استخدامك لموقعنا؛ لتخصيص التسويق والإعلان الذي نعرضه لك؛ لفهم كيفية استخدامك لموقعنا؛ لتقديم الخدمات، لفهم احتياجات عملائنا بشكل أفضل، وتقديم توصيات مخصصة حول منتجاتنا وخدماتنا.`
            : `Analytics and personalization. We use personal information to conduct research and analysis, including to improve our platform; to understand how you interact with our platform, advertisements, and communications with you to determine which of our products or services are the most popular; marketing campaigns; to personalize your experience; to personalize the marketing and advertising we show you; to understand how you use our platform; to provide services; to better understand the needs of our customers, and to make personalized recommendations about our products and services.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `الالتزامات القضائية العدلية. قد نوفر إمكانية الوصول إلى معلوماتك بما في ذلك معلومات التعريف الشخصية، عندما يُطلب منا قضائياً القيام بذلك، بما في ذلك الامتثال لأمر المحكمة، أو التعاون مع تحقيقات الشرطة، أو فيما يتعلق بالإجراءات القانونية الأخرى.`
            : `Judicial obligations. We may provide access to your information, including personally identifiable information, when we are judicially required to do so, including complying with a court order, cooperating with police investigations, or in connection with other legal proceedings.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `يجوز لنا أيضًا استخدام المعلومات لأغراض أخرى سيتم الكشف عنها لك قبل الشروع في جمع فيه هذه المعلومات. على سبيل المثال، نحصل على موافقة محددة من العملاء قبل نشر شهادات العملاء وتعليقاتهم ومراجعتهم على موقعنا والتي قد تحتوي على معلومات شخصية.`
            : `We may also use the information for other purposes that will be disclosed to you before the time of collecting such information. For example, we obtain specific consent from customers before posting customer testimonials and reviews on our platform in cases that contain personal information.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? ` للبحث العلمي والدراسات، حيث أنه إذا استدعى له الحاجة، فإن البيانات يتم استدعائها بشكل تجميعي وتخزينها بطريقة لا يمكن تمييز أو معرفة هوية المستخدم (الطرف الثاني أو الطرف الثالث) وذلك لغايات الدراسات و الابحاث العلمية.`
            : `For scientific research and studies. The data is summoned in aggregated data and stored in a way that the user cannot be distinguished or identified (second party or third party) for the purposes of studies and scientific research.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? ` عند توقيعك على الموافقة على سياسة الخصوصية فأنك موافق على أن تستخدم بياناتك كجزء من البيانات المجمعة (بشكل تجميعي مع عدم إمكانية تحديد هويتك) لغايات الدراسات و البحث العلمي.`
            : `By signing the consent to the “Privacy Policy”, you agree that your data will be used as part of the aggregated data and in aggregated data format (collectively with no identification) for the purposes of scientific research and other studies.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? ` الارشفة الالكترونية للمستخدم للخدمات الطبية`
            : `Electronic archiving of the user for medical services.`}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? ` تقديم خدمات خاصة ومناسبة للمستخدم.`
            : `Providing special and appropriate services to the user.`}
        </Typography>

        <Typography paragraph>{curLangAr ? ` خدمات تسويقية.` : `Marketing services.`}</Typography>

        <Typography variant="h4">
          {curLangAr
            ? 'سادساً: التغييرات في سياسة خصوصية هذا الموقع'
            : 'Sixth: Changes in the “Privacy Policy” of the platform'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `قد تقوم منصة حكيمنا بتحديث سياسة خصوصية الموقع الإلكتروني وتطبيقاتها في أي وقت ولأي سبب، لذلك نشجعك على مراجعة هذه الصفحة بشكل دوري للحصول على أحدث المعلومات حول ممارسات الخصوصية لدينا.`
            : `Hakeemna.com may update the “Privacy Policy” of the platform and its applications at any time and for any reason, so we encourage you to review this page periodically for the latest information about our “Privacy Practices”. We will inform you if there are any new updates.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr ? 'سابعاً: سياسة ملفات تعريف الارتباط.' : 'Seventh: Cookies Policy.'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `منصة حكيمنا لا تستخدم أدوات كوكيز في الصفحة، البيانات في حوزة المنصة هي التي تقوم انت بتخزينها في النظام وذلك بعد أن تقوم بفتح حساب في المنصة.`
            : `Hakeemna.com platform does not use cookies on the platform, the data in the possession of the platform is stored by you after creating your account.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr ? 'ثامناً: الخسائر والتعويضات' : 'Eighth: Losses and compensation'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `المنصة والتطبيقات التابعة لها لا تقدم أي نصائح أو استشارات طبية ولا تبيع أي سلعة من طرفها، وعليها اذا وجد محتوى أو رأي فهي من مسؤولية الشخص الذي قام بنشرها، والمنصة ليست ملزمة بالملاحقة القانونية لأي ضرر يقع لأحد الأطراف المتضررة من محتوى او استشارة او غيرها، ومنه فإن الملاحقة القانونية ودفع تكاليفها والالتزام بالأضرار هي خارج عن نطاق مسؤولية المنصة ومالكيها.`
            : `The platform and its applications do not provide any medical consulting or advice, and do not sell any commodity. In the case that there is content or opinion, it is the responsibility of the user who published it, and the platform is not obligated to prosecute any damage caused to one of the affected parties from content, consultation, or others.`}
        </Typography>

        <Typography variant="h4">
          {curLangAr ? 'تاسعا: حذف الحساب والبيانات' : 'Ninth: Delete the account and data'}
        </Typography>

        <Typography paragraph>
          {curLangAr
            ? `المستخدم يستطيع حذف حسابه من المنصة وذلك بالدخول الى قسم "ملفي التعريفي" ومن ثم الدخول الى قسم "الاعدادات" و النقر على "حذف الحسابي"، وبهذه الطريقة يقوم المستخدم بحذف الحساب من كامل المنصة، كذلك لديه الامكانية لحذف جزء من المعلومات التي يشاء. على سبيل المثال: يستطيع حذف المعلومات الطبية و التقارير الطبية التي قام المستخدم بتخزينها بنفسه في المنصة، في هذه الحالة عليها التوجه الى قسم "ملفاتي" ثم النقر على "التقارير الطبية" ومن بعدها اختيار "التقارير الطبية القديمة" والتي من خلالها يستطيع تحديد ما يريد حذفه من المنصة`
            : `The user can delete his account from the platform by entering the "My Profile" section, then entering the "Settings" section, and clicking on "Delete My Account". In this way, the user deletes the account from the entire platform. He also has the ability to delete part of his information that he wants. For example: The user can delete medical information and medical reports that he has stored himself on the platform. In this case, he should go to the "My Files" section, then click on "Medical Reports," and then choose "Old Medical Reports," then he can specify which documents he wants to delete from the platform.`}
        </Typography>
      </Stack>
    </Box>
  );
}
