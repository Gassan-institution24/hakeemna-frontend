import React, { useRef } from 'react';

import { Box, List, Paper, Divider,ListItem, Container, Typography, ListItemText,  } from '@mui/material';

export default function ProviderPolicy() {
  const sectionRefs = {
    intro: useRef(null),
    terms: useRef(null),
    responsibility: useRef(null),
    support: useRef(null),
    clients: useRef(null),
    data: useRef(null),
    rights: useRef(null),
    guarantees: useRef(null),
    comments: useRef(null),
    ads: useRef(null),
    payment: useRef(null),
    billing: useRef(null),
    remoteCare: useRef(null),
    credit: useRef(null),
    tax: useRef(null),
    suspension: useRef(null),
    fees: useRef(null),
    timing: useRef(null),
    disclaimer: useRef(null),
    compliance: useRef(null),
    advice: useRef(null),
    record_law: useRef(null),
    client_only: useRef(null),
    equity: useRef(null),
    confidentiality: useRef(null),
    exceptions: useRef(null),
    ownership: useRef(null),
    limits: useRef(null),
    termination: useRef(null),
    indemnity: useRef(null),
    disputes: useRef(null),
    other_terms: useRef(null),
    agreement: useRef(null),
    changes: useRef(null),
    feedback: useRef(null),
    trial_features: useRef(null),
    no_assignment: useRef(null),
    enforceability: useRef(null),
    continuity: useRef(null),
    client_name: useRef(null),
    force_majeure: useRef(null),
    notifications: useRef(null),
    cookies: useRef(null),
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', py: 4 }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: '25%',
          pr: 2,
          position: 'sticky',
          top: 20,
          height: 'fit-content',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          zIndex: 1,
          display: { md: 'block', xs: 'none' },
        }}
      >
        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'rgba(219, 255, 247, 0.37)' }}>
        <Typography variant="h6">
          السياسات المتعلقة بمزودي الخدمات الطبية (عيادات، مراكز صحية، مستشفيات و الموردين)
        </Typography>
        <Divider sx={{ my: 2 }}/>
          <List>
            <ListItem
              button
              onClick={() => sectionRefs.intro.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="تعريف مصطلحات" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                sectionRefs.responsibility.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ListItemText primary="المسؤولية" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.support.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="مسؤولية الدعم الفني" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.clients.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="مسؤولية العملاء (الطرف الثالث)" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.data.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="معلومات وبيانات العملاء (الطرف الثالث)" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.rights.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="حقوق المحتوى" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.comments.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="التعليقات" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.ads.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="الإعلانات" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.cookies.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="سياسة cookies" />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Main Content */}
      <Box sx={{ width: { md: '75%', xs: '100%' } }}>
        <Typography variant="h5" align="center" gutterBottom ref={sectionRefs.intro}>
          السياسات المتعلقة بمزودي الخدمات الطبية (عيادات، مراكز صحية، مستشفيات و الموردين)
        </Typography>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#E4F6F2' }}>
          <Box>
            <Typography variant="h6" gutterBottom ref={sectionRefs.terms}>
              أحكام و شروط الاستخدام
            </Typography>
            <Typography variant="body1" paragraph>
              الرجاء قراءة أحكام و شروط الاستخدام بعناية مع استيعاب كل البنود قبل التوقيع على قبولها
              و قبل استخدام الموقع Hakeemna.com أو التطبيقات المرتبطة بها أو الصفحات ذو علاقة
              بالمنصة.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.responsibility}>
              تعريف المصطلحات
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>الطرف الأول:</strong> هو منصة حكيمنا. كوم. عندما يتم ذكر مصطلح المنصة أو
              حكيمنا.كوم أو Hakeemna.com أو منصة Hakeemna.com أو نظام في هذا القسم فإنه يشمل الموقع
              الالكتروني، التطبيقات على Android أو IOS، المواقع الالكترونية ذو علاقة مع المنصة،
              المدراء و الموظفين العاملين في المنصة.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>الطرف الثاني:</strong> هو المستخدم والمستفيد من الخدمات الطبية المقدمة من
              الممارسين لمهنة الطب و الموردين للخدمات ذات علاقة بالقطاع الصحي، حيث أن مصطلح المستخدم
              أو المستفيد يشمل المريض وعائلته التي تستخدم المنصة والزائرين للمنصة.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>الطرف الثالث:</strong> مزودي الخدمات الطبية ولديهم اشتراك فعال، على سبيل
              المثال ممارس مهنة الطب مثل عيادة، مركز صحي، مركز أشعة، طبيب نفسي، مؤسسة مستلزمات طبية
              وغيرهم ممن يقومون بتزويد خدمات أو بيع سلعة لها علاقة بالقطاع الصحي للطرف الثاني، أي أن
              الطرف الثالث هو أي شخص طبيعي أو اعتباري ومرخص له حسب القانون في بلد إقامته في العمل
              بشكل مباشر أو غير مباشر في القطاع الصحي.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة لمزود الخدمة في الأحكام وشروط الاستخدام يطلق عليه كذلك مصطلح عميل ويشمل هذا
              المصطلح الموظفين العاملين في مؤسسته أو شركته.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.responsibility}>
              المسؤولية
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>مسؤولية الدعم الفني:</strong> Hakeemna.com تقدم الدعم الفني من الساعة الحادية
              عشر صباحا الى الساعة الثانية ظهرا (بتوقيت المملكة الأردنية الهاشمية) خلال أيام العمل
              الرسمي من يوم السبت الى يوم الخميس، ما عدا أيام العطل الرسمية.
            </Typography>
            <Typography variant="body1" paragraph>
              تستطيع طلب الدعم الفني من خلال الأدوات المتاحة في المنصة:
            </Typography>
            <Typography variant="body1" paragraph>
              - من خلال الصفحة الرئيسية، وذلك بالنقر على مركزالدعم الفني أسفل كل صفحة.
            </Typography>
            <Typography variant="body1" paragraph>
              - الاتصال على الهاتف 00962780830087
            </Typography>
            <Typography variant="body1" paragraph>
              - البريد الالكتروني: info@hakeemna.com
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.clients}>
              مسؤولية العملاء (الطرف الثالث)
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>الوصول والدخول على المنصة:</strong> العميل المشترك بالمنصة يتعهد بأنه لن يسمح
              لأي شخص ليس من موظفيه من الوصول والدخول الى النظام، كذلك فإن العميل مسؤول عن امتثال
              موظفيه لشروط الخدمة وعدم ارتكاب جرم ضمن نطاق قانون الجرائم الالكترونية وعليهم الامتثال
              لقانون حماية البيانات الشخصية.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>قيود الاستخدام:</strong> ليس مسموح للعميل أو أحد موظفيه عمل التالي:
              <ul>
                <li>
                  بيع أو إعادة بيع أو تأجير أو استئجار الخدمة، أو استخدام الخدمة خارج نطاق عملياتها
                  الداخلية؛
                </li>
                <li>
                  استخدام الخدمة لتخزين أو إرسال رسائل البريد الإلكتروني التسويقية غير المرغوب فيها
                  أو المواد المخالفة أو التشهيرية أو غير القانونية أو الضارة، أو لتخزين أو إرسال
                  مواد تنتهك حقوق الطرف الأول والطرف الثاني أو طرف ثالث؛
                </li>
                <li>التدخل في سلامة أو أداء الخدمة أو تعطيلها؛</li>
                <li>
                  محاولة الوصول غير المصرح به إلى الخدمة أو أنظمتها أو شبكاتها أو قاعدة البيانات؛
                </li>
                <li>
                  تعديل أو نسخ الخدمة أو إنشاء أعمال مشتقة بناءً على الخدمة أو أي جزء أو ميزة أو
                  وظيفة أو واجهة مستخدم؛
                </li>
                <li>استخدام الخدمة في انتهاك لأي قانون؛</li>
                <li>الوصول إلى الخدمة لبناء خدمة أو عرض تنافسي.</li>
              </ul>
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.data}>
              معلومات وبيانات العملاء (الطرف الثالث)
            </Typography>
            <Typography variant="body1" paragraph>
              تظل جميع البيانات والمعلومات والصور والوثائق والملفات التي أدخلها العميل أو قام
              بتحميلها إلى الخدمة ملكًا للعميل، مع الأخذ بعين الاعتبار بقية الشروط الأخرى الواردة في
              شروط الاستخدام هذه.
            </Typography>
            <Typography variant="body1" paragraph>
              يمنح العميل Hakeemna.com ترخيصًا غير حصري وخاليًا من حقوق الملكية لتعديل معلومات
              العميل وتخزينها ونقلها واستخدامها لتنفيذ مهام المنصة بشكل صحيح ومتكامل.
            </Typography>
            <Typography variant="body1" paragraph>
              العميل هو المسؤول الوحيد عن صحة المعلومات التي يقوم بادخالها في المنصة (مثل معلومات
              المرضى والادوية)، كذلك يجب عليه أن يمنع الوصول غير المصرح به إلى المنصة و الى البيانات
              ويجب عليه إخطار Hakeemna.com على الفور بأي وصول غير مصرح به ، ولا يجوز له استخدام
              الخدمة إلا وفقًا للأغراض المقصودة والقانون المعمول به.
            </Typography>
            <Typography variant="body1" paragraph>
              يقر العميل ويضمن لــ Hakeemna.com أن جميع معلومات العميل (على سبيل المثال المرضى) وأي
              مواد أخرى مقدمة أو مخزنة بموجب حساب العميل، من قبل العميل أو نيابة عنه، صحيحة ودقيقة.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.rights}>
              حقوق المحتوى
            </Typography>
            <Typography variant="body1" paragraph>
              يجوز للعميل تحميل أو إرسال محتوى وملفات ومعلومات إلى الطرف الثاني أو الطرف الثالث
              المسجلين في منصة Hakeemna.com. يحتفظ العميل بحقوق الطبع والنشر وأي حقوق ملكية أخرى قام
              بتخزينها هو في المحتوى الذي يقدمه العميل إلى Hakeemna.com.
            </Typography>
            <Typography variant="body1" paragraph>
              يوافق العميل بموجب هذا لــ Hakeemna.com ترخيصًا غير حصري وغير قابل للإلغاء ودائم وخالٍ
              من حقوق الملكية لعرض وتخزين وتوزيع ومشاركة وتعديل واستخدام هذا المحتوى لأغراض تقديم
              الخدمة المتفق عليها بين العميل مع منصة Hakeemna.com.
            </Typography>
            <Typography variant="body1" paragraph>
              يتعهد العميل بالاحتفاظ بنسخ احتياطية مما يقوم بتخزينه في المنصة، المنصة ليست مسؤولة عن
              البيانات التي يتم ضياعها وفقدانها.
            </Typography>
            <Typography variant="body1" paragraph>
              بموافقة العميل على شروط وأحكام الاستخدام بأنه على علم بأنه في ما يخص حقوق المحتوى قد
              يشترك بعض تلك البيانات في حق الملكية مع أطراف أخرى، على سبيل المثال وليس الحصر: الطرف
              الثاني (مثل المرضى) أو الطرف الأول (المنصة).
            </Typography>
            <Typography variant="body1" paragraph>
              في ما يخص البيانات التي يقوم العميل بتخزينها ولها علاقة في المرضى، فإن جزء من تلك
              المعلومات هي من حقوق المريض (الطرف الثاني)، على سبيل المثال: التقرير الطبي، الوصفة
              الطبية، التحاليل، الفاتورة، سند الوصل، و أي مستند قام الطرف الثالث بمشاركة الطرف
              الثاني فيه.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة لحقوق المحتوى المتعلقة مع الطرف الأول (المنصة) مع الطرف الثالث (على سبيل
              المثال الطبيب، مركز تحاليل).
            </Typography>
            <Typography variant="body1" paragraph>
              بالتوقيع على شروط و أحكام الاستخدام فأنت (العميل) على علم و موافق بأن يتم استخدام
              البيانات بشكل تجميعي (aggregated data) لأهداف وغايات Hakeemna.com مثل التحليل، تحسين
              تجربة المستخدم، للبحث العلمي وغيرها من الأهداف.
            </Typography>
            <Typography variant="body1" paragraph>
              يقر العميل بأن المحتوى الذي يتم تخزينه ومشاركته في المنصة لا يخالف قانون وزارة الصحة و
              قانون النقابات المهنية، و أنه على علم ودراية بأن أي محتوى مخالف لقانون النقابات
              المهنية أو وزارة الصحة ويتم اكتشافه من قبل إدارة المنصة فإنه سيتم حذفه بشكل مباشر بدون
              إعلام مسبق.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.guarantees}>
              ضمانات المحتوى
            </Typography>
            <Typography variant="body1" paragraph>
              يقر العميل و يضمن التالي:
            </Typography>
            <ul>
              <li>
                عدم انتهاك أي محتوى يقوم بنشره او تخزينه في المنصة لأي حقوق نشر أو سر تجاري أو
                خصوصية أو أي حق آخر لطرف ثالث (مثل مزودي الخدمات) أو أحد أفراد الطرف الثاني (مثل
                المرضى) للطرف الأول (المنصة).
              </li>
              <li>
                لن يرسل أي محتوى غير صحيح أو تشهيري أو ضار بأي شخص أو ينتهك قواعد خصوصية HIPAA أو
                قوانين الدولة بشأن خصوصية المريض.
              </li>
              <li>
                كل معلومات التي يقدمها العميل في منصة Hakeemna.com حول المرضى وغيرها من المعلومات
                صحيحة دقيقة، وحصلت على موافقة المريض أو المسؤول عنها، وتتوافق مع المبادئ التوجيهية
                الأخلاقية للجمعيات الطبية المهنية وكذلك مجالس الممارسة الطبية وقوانين حماية البيانات
                الشخصية و قانون الجرائم الإلكترونية.
              </li>
              <li>
                بالاضافة الى السابق، يقر العميل بأنه قام بإجراء 3 خطوات تحقق و تأكد من هوية المريض
                قبل الشروع في إدخال البيانات او اي اجراء اخر . لذلك يجب أن يتوافق معلومات التحقق
                المقدمة من قبل المريض مع بيانات الرقم الوطني للمريض، اسم المريض الثلاثي وأحد
                البيانات التالية: تاريخ الميلاد، رقم الهFاتف، البريد الالكتروني، الجنسية.
              </li>
              <li>
                فـــي حال تم الشك في هوية المريض أو التزوير أو عدم تطابق المعلومات، فإن العميل يقوم
                بإعلام المنصة بتلك الملاحظات.
              </li>
            </ul>

            <Typography variant="body1" paragraph>
              عند قيام العميل بمشاركة معلومات مريض (الطرف الثاني) مع طرف آخر (مثل طبيب استشاري) ،
              يجب أن يحصل على موافقة المريض قبل مشاركة تلك المعلومات.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.comments}>
              التعليقات والآراء على المنصة
            </Typography>
            <Typography variant="body1" paragraph>
              المنصة لا تؤيد أو تتحقق من دقة أو توافق بالضرورة على أي من التعليقات والروابط والمحتوى
              الذي ينشره المستخدمون أو العملاء على الخدمة، و تحتفظ ادارة المنصة بالحق في رفض نشر أي
              تعليق من الطرف الثاني (مثل المريض) أو من الطرف الثالث (مثل العميل).
            </Typography>
            <Typography variant="body1" paragraph>
              المنصة تقدم خدمة التقييم ، لذلك يقر الطرف الثالث (العميل) ويضمن أنه: لن يدفع أو يحث أو
              يعرض حوافز من أي نوع (مثل الخصومات أو الهدايا المجانية أو المبالغ المستردة أو بطاقات
              الهدايا أو مشاركات المسابقات أو العروض والصفقات) لنشر أو إزالة تعليقات أو لمنع
              التعليقات حول ممارسته أو ممارسة منافسيه.
            </Typography>
            <Typography variant="body1" paragraph>
              المحتوى الممكن حذفه هو ذلك المحتوى الذي يحض على الكراهية، العنصرية، العنف، البذيء،
              الفاحش، أو ذلك المحتوى المخالف لقانون حماية الجرائم الالكترونية وقانون حماية البيانات
              الشخصية.
            </Typography>
            <Typography variant="body1" paragraph>
              يقر العميل بحذف أي تعليق قام بكتابته مريض وطلب منه ذلك المريض بحذفه.
            </Typography>
            <Typography variant="body1" paragraph>
              يقر العميل بأنه سوف يحذف مباشرة أي محتوى قام بنشره و مخالف للبنود أعلاه.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.ads}>
              الإعلانات
            </Typography>
            <Typography variant="body1" paragraph>
              تحتفظ ادارة المنصة بالحق في وضع إعلانات أو رسائل من أطراف خارجية على صفحات الويب
              الخاصة بالإعلانات المجانية وكذلك في الاصدارات المجانية من الخدمة. قد تكون مثل هذه
              الإعلانات أو الرسائل مرئية لجميع الأطراف (مثل مرضى و / أو مزود الخدمات الطبية).
            </Typography>

            <Typography variant="h6" gutterBottom>
              خدمات الرعاية الصحية المقدمة عن بعد
            </Typography>
            <Typography variant="body1" paragraph>
              تم تصميم المنصة لتسهيل عملية تقديم خدمات الرعاية الصحية.
            </Typography>
            <Typography variant="body1" paragraph>
              تعني تقديم الخدمات الطبية عن بعد: تقديم الرعاية الطبية من قبل مزود الخدمة الطبية
              (الطرف الثالث) للمريض (الطرف الثاني) الموجود فعليًا في موقع آخر من خلال استخدام
              تكنولوجيا الاتصالات المتقدمة التي تسمح لمقدمي الخدمة برؤية المريض وسماعه عن بُعد في
              الوقت الفعلي.
            </Typography>
            <Typography variant="body1" paragraph>
              تقييم حالة المريض عن بعد واتخاذ القرارات والإجراءات اللازمة تقع تحت طائلة مسؤولية مزود
              تلك الخدمة (الطرف الثالث)، ومنها نقوم بتفصيل مسؤوليات الطرف الثالث في هذا النوع من
              الخدمة:
              <ul>
                <li>
                  توفير كافة خدمات الرعاية الطبية عن بعد وجميع الخدمات الطبية المهنية الأخرى
                  والجوانب المتعلقة بممارسة الطرف الثالث لمهنته كما لو كان خدمة الرعاية في مقر
                  مزاولة المهنة القانوني.
                </li>
                <li>
                  توثيق و تسجيل خدمات الرعاية الطبية عن بعد في السجلات السريرية للمريض (الطرف
                  الثاني).
                </li>
                <li>الفوترة والتحصيل لخدمات الرعاية الطبية عن بعد.</li>
                <li>
                  إخطار أي طرف ثالث و/أو الحصول على موافقته فيما يتعلق بتقديم خدمات الرعاية الطبية
                  عن بعد من خلال Hakeemna.com
                </li>
                <li>
                  التأكد من استخدام Hakeemna.com وفقًا للتعليمات المعمول بها ومواد التدريب والمواد
                  الأخرى عبر الإنترنت التي قد توفرها المنصة من وقت لآخر، كذلك الالتزام بتقديم الخدمة
                  وفقا لأفضل الممارسات المهنية في مجال تخصص الطرف الثالث عند تقديم خدمة الرعاية عن
                  بعد.
                </li>
                <li>
                  الامتثال للقوانين والمعايير المعمول بها التي تفرضها برامج الرعاية الصحية الحكومية
                  و الخاصة و النقابات المهنية والمؤسسات ذو سلطة والجهات الدافعة الأخرى ووكالات
                  الترخيص وهيئات الاعتماد المعمول بها، بما في ذلك، على سبيل المثال لا الحصر، فيما
                  يتعلق بتقديم خدمات الرعاية الطبية عن بعد.
                </li>
                <li>
                  استخدام كافة وسائل حماية الخصوصية للمرضى و لمنصة Hakeemna.com عند استخدام وسائل
                  التواصل مع المرضى لتقديم خدمة الرعاية الصحية عن بعد.
                </li>
              </ul>
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.cookies}>
              سياسة cookies
            </Typography>
            <Typography variant="body1" paragraph>
              لا نستخدم أدوات كوكيز في الصفحة، نجمع البيانات التي تقوم أنت بتخزينها في النظام وذلك
              بعد أن تقوم بفتح حساب في المنصة.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
