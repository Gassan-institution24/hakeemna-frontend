import React, { useRef } from 'react';

import {
  Box,
  List,
  Paper,
  Divider,
  ListItem,
  Container,
  Typography,
  ListItemText,
} from '@mui/material';

export default function ProviderPolicy() {
  const sectionRefs = {
    intro: useRef(null),
    terms: useRef(null),
    responsibility: useRef(null),
    noresponsibility: useRef(null),
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
    conflict: useRef(null),
    online: useRef(null),
    cookies: useRef(null),
    limitation: useRef(null),
    dataReturn: useRef(null),
    compensation: useRef(null),
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
          <Divider sx={{ my: 2 }} />
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
              onClick={() => sectionRefs.online.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="خدمات مقدمة عن بعد" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.payment.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="شروط الدفع" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                sectionRefs.noresponsibility.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ListItemText primary="اخلاء المسؤولية" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.compliance.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="الامتثال" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.ownership.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="حقوق الملكية" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.limitation.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="حدود المسؤولية" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.dataReturn.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="المدة والإنهاء وإعادة البيانات" />
            </ListItem>

            <ListItem
              button
              onClick={() =>
                sectionRefs.compensation.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ListItemText primary="التعويض" />
            </ListItem>
            <ListItem
              button
              onClick={() => sectionRefs.conflict.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ListItemText primary="حل النزاعات" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                sectionRefs.other_terms.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ListItemText primary="شروط أخرى" />
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

            <Typography variant="h6" gutterBottom ref={sectionRefs.online}>
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
            <Typography variant="h6" gutterBottom ref={sectionRefs.payment}>
              شروط الدفع
            </Typography>
            <Typography variant="body1" paragraph>
              يتعين على العميل (الطرف الثالث) دفع جميع الرسوم المحددة في الطلب والخدمات ذات الصلة
              كما هو محدد في الاتفاقية بين Hakeemna.com والعميل.
            </Typography>
            <Typography variant="body1" paragraph>
              ما لم يُذكر خلاف ذلك، فإن الرسوم الواردة في الفاتورة مستحقة عند الاستلام.
            </Typography>
            <Typography variant="body1" paragraph>
              العميل مسؤول عن تقديم معلومات كاملة ودقيقة لإصدار الفواتير بشكل صحيح والإعلام بأي
              تغييرات تطرأ على هذه المعلومات.
            </Typography>
            <Typography variant="body1" paragraph>
              طريقة السداد عن طريق بطاقة الائتمان او الدفع الالكتروني.
            </Typography>
            <Typography variant="body1" paragraph>
              على العميل عند استلام الفاتورة دفع كامل المبلغ بالدينار الأردني.
            </Typography>
            <Typography variant="body1" paragraph>
              الفاتورة تذكر بشكل واضح تاريخ استحقاق دفع المبلغ ولا يمكن دفعها بعد ذلك التاريخ حيث
              أنه يعتبر بعد ذلك التاريخ بأنه لم يتم التسديد ويطبق عليها شروط البند تعليق الخدمة بسبب
              عدم الدفع.
            </Typography>
            <Typography variant="body1" paragraph>
              إذا كانت بطاقة الائتمان غير صالحة لأي سبب كان أو لم يتم السداد بطريقة أخرى، فيجب على
              العميل سداد المبلغ المستحق عند استلام الفاتورة.
            </Typography>
            <Typography variant="body1" paragraph>
              العميل على علم ويوافق على أن تقوم منصة Hakeemna.com بتحصيل الرسوم من بطاقة الائتمان
              هذه أو السحب من حساب العميل المصرفي مقابل جميع الخدمات المشتراة والخدمات ذات الصلة وأي
              تجديدات.
            </Typography>
            <Typography variant="body1" paragraph>
              العميل على علم بأن بعض المدفوعات ببطاقة الائتمان أو وسائل الدفع الإلكترونية الأخرى قد
              تخضع لرسوم إضافية (مثل processing fee) وهو يوافق على خصم تلك الرسوم الإضافية. مع العلم
              بأنه سيتم إعلام العميل حول تلك الرسوم الإضافية قبل الشروع في خصمها من حسابه.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.billing}>
              الفواتير
            </Typography>
            <Typography variant="body1" paragraph>
              باستثناء الضرائب المذكورة في فواتير العملاء، لا تتضمن رسوم Hakeemna.com أي ضرائب أو
              رسوم أخرى غير مفصح عنها في الفاتورة.
            </Typography>
            <Typography variant="body1" paragraph>
              العميل مسؤول عن سداد جميع الضرائب المرتبطة بمشترياته بموجب اتفاقية العميل.
            </Typography>
            <Typography variant="body1" paragraph>
              تتحمل إدارة Hakeemna.com وحدها المسؤولية عن الضرائب التي يمكن فرضها على المنصة بناءً
              على دخلها وممتلكاتها وموظفيها.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.suspension}>
              تعليق الخدمة بسبب عدم الدفع
            </Typography>
            <Typography variant="body1" paragraph>
              كل الإشعارات الرسمية المتعلقة بين العميل (الطرف الثالث) وإدارة Hakeemna.com تتم على
              البريد الإلكتروني للعميل المسجل في المنصة لتلك الغايات.
            </Typography>
            <Typography variant="body1" paragraph>
              على العميل التأكد ومراجعة بريده الإلكتروني بشكل دوري في البريد الداخل و البريد spam
              للتأكد من عدم وجود رسائل أو إشعارات من المنصة Hakeemna.com.
            </Typography>
            <Typography variant="body1" paragraph>
              تاريخ استحقاق الدفع المذكور في الفاتورة هو أقصى تاريخ ممكن تسديد فيه قيمة الفاتورة،
              وبعد ذلك التاريخ يتم اعتبارها بأنها غير مسددة.
            </Typography>
            <Typography variant="body1" paragraph>
              يجوز لإدارة Hakeemna.com تعليق أو إنهاء وصول العميل إلى المنصة وأي خدمات أخرى إذا لم
              يسدد العميل المبالغ المستحقة Hakeemna.com عند تاريخ استحقاقها.
            </Typography>
            <Typography variant="body1" paragraph>
              قبل 5 أيام من أي تعليق أو إنهاء خدمة، ستبذل إدارة Hakeemna.com جهودًا معقولة تجاريًا
              لإرسال إشعار إلكتروني إلى عنوان البريد الإلكتروني المسجل في حساب العميل ضمن الخدمة،
              حيث أن محتوى هذا الإشعار هو الإبلاغ عن أن إدارة Hakeemna.com ستقوم بتعليق أو إنهاء
              وصول العميل إلى المنصة والخدمات المرتبطة معها في حال لم يقم بتسديد مباشرة الالتزامات
              التي عليه مع المنصة.
            </Typography>
            <Typography variant="body1" paragraph>
              تحتفظ إدارة Hakeemna.com بالحق في فرض رسوم إعادة تفعيل الحساب على النحو المفصل على
              العملاء الذين تم تعليق حساباتهم بناءً على المدفوعات المتأخرة التي تم استلامها بعد أكثر
              من خمسة عشر (15) يومًا من تاريخ استحقاق الدفع.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة للمشتريات التي يتم الترويج لها بين الطرف الثالث مع الطرف الثاني أو بين الطرف
              الثالث من طرف ثالث آخر، هذه المشتريات والدفع والمطالبات المالية والنزاعات المالية هي
              خارج إطار عمل إدارة Hakeemna.com وليست مسؤولة عن متابعتها قانونيًا أو التحقق من
              مصداقية ما تم الاتفاق عليه أو ما تم استلامه، وعلى الأطراف المتنازعة الشروع في مطالبة
              حقوقهم وفقًا للقانون. في حال أدى ذلك النزاع إلى تسبب بمصاريف إدارة على المنصة، فإن
              الأطراف المتنازعة تتحمل تلك المصاريف وفقًا للقانون المعمول به.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.suspension}>
              تغيير في الرسوم والأجور لاستخدام المنصة
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة للعملاء الذين لديهم اتفاقيات دفع شهرية، يجوز تغيير جميع الرسوم بإخطار العميل
              قبل ستين (60) يومًا.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة لجميع العملاء، تحتفظ ادارة Hakeemna.com بالحق في زيادة أسعارها بما لا يزيد عن
              5% في أي وقت، وليس أكثر من مرة واحدة لكل فترة اثني عشر (12) شهرًا، بعد إخطار العميل
              قبل ثلاثين (30) يومًا، إلا في حال حدوث خطأ في التسعير أو في بنود الاتفاقية فإنه يتم
              التعديل.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة لجميع العملاء، يجوز لادارة Hakeemna.com زيادة الرسوم لتغطية تكلفة زيادات في
              التكاليف الغير متوقعة، مثل الزيادات التنظيمية و الامتثالية وغيرها من التكاليف المفروضة
              بسبب التغييرات في قوانين الدولة التي يقيم فيها العميل أو قوانين الدولة المقيم فيها
              إدارة Hakeemna.com ، وعليه فإن الإدارة ستطبق تلقائيًا زيادة الأسعار على جميع الخدمات
              المتأثرة بالتغيير بإخطار العميل قبل ثلاثين (30) يومًا.
            </Typography>

            <Typography variant="h6" gutterBottom>
              توقيت دفع العميل للالتزامات المالية
            </Typography>
            <Typography variant="body1" paragraph>
              كما هو محدد في نموذج الطلب او الفاتورة أو اتفاقية الاشتراك، فان تاريخ استحقاق الرسوم
              هو اقصى تاريخ ممكن تسديد فيها قيمة الفاتورة أو المطالبة المالية، وبعد ذلك التاريخ يتم
              اعتبارها بأنها غير مسددة.
            </Typography>
            <Typography variant="body1" paragraph>
              يوافق العميل على ان تقوم ادراة Hakeemna.com بتحصيل الرسوم من بطاقة العميل أو خصمها من
              حساب العميل وفقًا للاتفاقية.
            </Typography>
            <Typography variant="body1" paragraph>
              من خلال تقديم العميل لمعلومات الدفع لادراة Hakeemna.com ، يوافق العميل على أن ادراة
              Hakeemna.com مخولة، إلى الحد الذي يسمح به القانون المعمول به، تحصيل جميع الرسوم
              والتكاليف المستحقة بموجب هذه الاتفاقية على الفور، وأنه باستثناء ما يقتضيه القانون
              المعمول به، لا يلزم إشعار العميل أو الحصول على موافقة إضافية.
            </Typography>
            <Typography variant="body1" paragraph>
              يوافق العميل على إخطار ادراة Hakeemna.com على الفور بأي تغيير في معلومات الدفع
              المستخدمة للدفع بموجب هذه الاتفاقية. كذلك العميل على إدراك وفهم ويقر بأن جميع المبالغ
              يجب سدادها كحد اقصى في تاريخ الاستحقاق وأنه في حالة عدم استلام الدفع قبل تاريخ
              الاستحقاق ، بالإضافة إلى انتهاك الالتزامات التعاقدية للعميل، فقد يتم إيقاف الخدمة
              مؤقتًا أو إنهاؤها.
            </Typography>
            <Typography variant="body1" paragraph>
              في حال عدم قيام العميل بالسداد، فإنه على علم ادراك بانه يتحمل دفع جميع تكاليف التحصيل،
              بما في ذلك أتعاب المحاماة والتكاليف وجميع النفقات القانونية والتحصيلية الأخرى التي
              تتكبدها ادراة Hakeemna.com فيما يتعلق بتنفيذ حقوقها بموجب هذه الاتفاقية.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.noresponsibility}>
              التعهدات والضمانات؛ إخلاء المسؤولية
            </Typography>
            <Typography variant="body1" paragraph>
              استمرارية توفر وتواجد الخدمة: ستبذل Hakeemna.com جهودًا معقولة تجاريًا للحفاظ على وقت
              تشغيل بنسبة 99% باستثناء أي وقت تعطل مجدول وقضايا القوة القاهرة والتوقف لعمل خدمات
              الطرف الثالث.
            </Typography>
            <Typography variant="body1" paragraph>
              التعهدات والضمانات المتبادلة:
              <ul>
                كل طرف يقر ويضمن للطرف الاخر التالي:
                <li>
                  تم إبرام اتفاقية العميل بشكل صحيح وتشكل اتفاقية صالحة وملزمة وقابلة للتنفيذ وفقًا
                  لشروطها؛
                </li>
                <li>
                  لا يلزم الحصول على إذن أو موافقة من أي طرف ثالث فيما يتعلق بإبرام هذا العميل
                  للاتفاقية أو تنفيذه لها؛
                </li>
                <li>
                  إن إبرام اتفاقية العميل وتنفيذها لا ينتهك قوانين أي الدولة المقيم فيها أو شروط أو
                  أحكام أي اتفاقية أخرى يكون طرفًا فيها أو ملزمًا بها بطريقة أخرى.
                </li>
              </ul>
            </Typography>
            <Typography variant="h6" gutterBottom>
              إخلاء المسؤولية
            </Typography>
            <Typography variant="body1" paragraph>
              منصة Hakeemna.com تخلي مسؤوليتها عن جميع الضمانات، بما في ذلك على سبيل المثال لا
              الحصر، أي ضمان بأن الخدمة ستكون دون انقطاع أو خالية من الأخطاء أو بدون تأخير،
              والضمانات الضمنية للتسويق.
            </Typography>
            <Typography variant="body1" paragraph>
              منصة Hakeemna.com تتخذ التدابير المادية والفنية والإدارية المعقولة لتأمين الخدمة،
              فإنها لا تضمن عدم إمكانية المساس بالخدمة. كذلك تخلي منصة Hakeemna.com مسؤوليتها عن أي
              ضمان فيما يتعلق تحصيل المطالبات للعميل.
            </Typography>
            <Typography variant="body1" paragraph>
              من وقت لآخر، قد يطلب العميل إضافة بعض التعليمات البرمجية و/أو الوظائف المراد إضافتها
              إلى موقع العميل الإلكتروني أو أي منصة أخرى. لن تكون منصة Hakeemna.com مسؤولة عن ضمان
              امتثال التعليمات البرمجية و/أو الوظائف المطلوبة لأي قوانين ولوائح سارية تتعلق بأعمال
              العميل. يقر العميل ويوافق بموجب هذا على أنه وحده سيكون مسؤولاً عن ضمان امتثال موقع
              العميل الإلكتروني وعروض الخدمة، حتى لو كانت مدعومة من قبل منصة Hakeemna.com للقوانين
              واللوائح السارية.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.compliance}>
              الامتثال
            </Typography>
            <Typography variant="body1" paragraph>
              النصائح والاستشارات الطبية:
              <ul>
                <li>
                  منصة Hakeemna.com لا تقدم أي نصيحة أو استشارة طبية أو أي خدمات طبية أو تشخيصية أو
                  وصفًا للأدوية.
                </li>
                <li>
                  يوافق الطرف الثالث ( مزود الخدمات الطبية) على أنه المسؤول الوحيد عن التحقق من دقة
                  معلومات المريض (بما في ذلك، على سبيل المثال لا الحصر، الحصول على التاريخ الطبي
                  والدوائي والحساسية لجميع المرضى المعنيين)، والحصول على موافقة المريض على استخدام
                  منصة Hakeemna.com (بما في ذلك، على سبيل المثال لا الحصر، منصة المريض)، وجميع
                  قراراته أو أفعاله فيما يتعلق بالرعاية الطبية والعلاج ورفاهية مرضاه، بما في ذلك على
                  سبيل المثال لا الحصر، جميع أفعال العميل أو التقصير.
                </li>
                <li>
                  يتحمل الطرف الثالث (مزود الخدمة الطبية) جميع المخاطر المرتبطة لاستخدامها للمنصة
                  لتقديم الخدمة المطلوبة لعلاج المرضى.
                </li>
                <li>
                  لا تتحمل Hakeemna.com ولا الجهات التابعة لها أي مسؤولية أو التزام عن الضرر (ملموس
                  او غير ملموس) أو الإصابة (بما في ذلك الوفاة) للعميل أو المريض أو الأشخاص الآخرين
                  أو الممتلكات الملموسة عن أي استخدام للخدمة.
                </li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              إلتزام و امتثال العميل لقوانين الاحتفاظ بالبيانات الطبية والوصول إلى سجلات المرضى:
              <ul>
                <li>
                  العميل مسؤول عن فهم جميع القوانين المحلية وقوانين الدولة المتعلقة بالاحتفاظ
                  بالسجلات الطبية، ووصول المريض إلى المعلومات، والحصول على تفويض المريض لإصدار
                  البيانات والالتزام بها. يجب أن يقوم العميل بالتواصل الفعال مع المنصة في حال وجود
                  أي تعارض بين قوانين العمل الداخلية في المنصة مع القوانين المحلية أو في الدولة التي
                  يعمل فيها.
                </li>
                <li>
                  يتعين على العميل الحصول على أي موافقة ضرورية من المريض قبل استخدام معلومات المخزنة
                  في المنصة.
                </li>
                <li>
                  بعد حصول العميل على الموافقات اللازمة؛ كجزء من الخدمة التي يطلبها العميل، يجوز
                  لمنصة Hakeemna.com أداء أو المساعدة في أداء وظيفة أو نشاط نيابة عن العميل والتي قد
                  تتضمن استخدام وإفشاء معلومات صحية محمية.
                </li>
                <li>
                  لن تقوم منصة Hakeemna.com بجمع أو الاحتفاظ أو استخدام أو الكشف عن أو معالجة
                  معلومات العميل الشخصية لأي غرض آخر غير أداء الخدمة.
                </li>
                <li>
                  ستقتصر منصة Hakeemna.com على جمع معلومات العميل الشخصية واستخدامها والاحتفاظ بها
                  والإفصاح عنها للأنشطة الضرورية والمتناسبة بشكل معقول لتوفير الخدمة أو لتحقيق غرض
                  تشغيلي آخر متوافق.
                </li>
                <li>
                  لن تقوم منصة Hakeemna.com بجمع أو استخدام أو الاحتفاظ أو الكشف عن أو بيع أو توفير
                  معلومات العميل الشخصية لأغراض تجارية خاصة منصة Hakeemna.com أو بطريقة لا تتوافق مع
                  القانون في المملكة الاردنية الهاشمية. ومع ذلك، يجوز لمنصة Hakeemna.com إنشاء
                  واستخلاص بيانات مجهولة المصدر (مجهول هوية العميل) و/أو مجمعة لا تحدد هوية العميل
                  أو أي مستهلك أو أسرة، واستخدام أو نشر أو مشاركة هذه البيانات مع أطراف ثالثة لتحسين
                  منتجات وخدمات منصة Hakeemna.com ولأغراض تجارية قانونية أخرى للمنصة أو لغايات البحث
                  العلمي.
                </li>
                <li>
                  على الرغم مما سبق، وبموافقة العميل، يجوز لمنصة Hakeemna.com مشاركة معلومات الاتصال
                  الخاصة بالعميل مع شركاء معينين قد نعمل معهم.
                </li>
                <li>
                  يجب على منصة Hakeemna.com الامتثال فورًا لأي طلب أو تعليمات من العميل تتطلب من
                  منصة Hakeemna.com تقديم أو تعديل أو نقل أو حذف معلومات العميل الشخصية.
                </li>
                <li>
                  إذا كان القانون يتطلب من منصة Hakeemna.com الكشف عن معلومات العميل الشخصية لغرض
                  غير مرتبط بالخدمة، فيجب على منصة Hakeemna.com أولاً إبلاغ العميل بالمتطلب القانوني
                  ومنح العميل فرصة للاعتراض أو الطعن في المتطلب، ما لم يحظر القانون مثل هذا الإخطار.
                </li>
                <li>
                  يجوز لمنصة Hakeemna.com التعاقد مع شركات خارجية مؤهلة ومختصة لتوفير خدمة معينة أو
                  دعم للمنصة، ولن تقدم المنصة أي افصاحات للعملاء حول تلك الشركات المتعاقد معها.
                </li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              العميل وحده مسؤول عن:
              <ul>
                <li>تحديد القوانين التي تنطبق عليه.</li>
                <li>
                  تقديم أي إشعارات بممارسات الخصوصية الخاصة بك والتي قد تكون مطلوبة بموجب القانون
                  الساري في مكان عملك.
                </li>
                <li>
                  يتحمل العميل وحده المسؤولية عن الاستجابة للطلبات تحقيق العدالة و القانونية بما في
                  ذلك على سبيل المثال لا الحصر محتوى وتوقيت الاستجابة؛ و في حال استلزم الأمر، ستقدم
                  منصة Hakeemna.com مساعدة معقولة للعميل في الرد على طلبات القانون.
                </li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              سياسة مكافحة التمييز:
              <ul>
                <li>
                  في منصة Hakeemna.com نسعى جاهدين لخلق بيئة يتم تقدير الأشخاص على قدم المساواة وحيث
                  نعمل نحن وعملائنا معا للقيام بدورنا للمساعدة في إنهاء التمييز.
                </li>
                <li>
                  ونتيجة لذلك، قامت منصة Hakeemna.com بتبني سياسة مكافحة التمييز التي تشمل عملائنا.
                </li>
                <li>
                  لن تتسامح منصة Hakeemna.com مع العملاء الذين ينخرطون في أمثلة متطرفة من التمييز
                  الصارخ أو العدوان اللفظي في تفاعلاتهم مع موظفي المنصة أو علنًا على القنوات التواصل
                  الاجتماعية.
                </li>
                <li>
                  يشمل هذا التمييز ضد أو العدوان اللفظي تجاه أي عرق أو عقيدة دينية أو لون أو أصل
                  وطني أو نسب أو إعاقة جسدية أو إعاقة عقلية أو حالة طبية أو معلومات وراثية أو الحالة
                  الاجتماعية أو الجنس أو النوع أو الهوية الجنسية أو العمر.
                </li>
                <li>
                  يوافق العميل ويفهم أن انتهاك العميل لهذه السياسة يعد خرقًا لاتفاقية العميل لإنهاء
                  الخدمة.
                </li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              المعلومات السرية
            </Typography>
            <Typography variant="body1" paragraph>
              نقصد بالمعلومات السرية جميع المعلومات غير العامة التي يكشف عنها أحد الطرفين (المُفصح)
              للطرف الآخر (المستلم)، سواء شفهيًا أو بصريًا أو كتابيًا، والتي تم تصنيفها على أنها
              سرية أو التي من المعقول أن يُفهم أنها سرية نظرًا لطبيعة المعلومات وظروف الكشف عنها.
              تتضمن المعلومات السرية لمنصة Hakeemna.com دون الحصر، الأجزاء غير العامة (غير موجودة في
              الصفحة الرئيسية للمنصة) من الخدمة والأدوات الإلكترونية وغيرها المقدمة لتسيير عمل
              العميل، وتتضمن المعلومات السرية للعميل، دون حصر، معلومات العميل{' '}
              <ul>
                <li>
                  يتعين على متلقي المعلومات السرية أن يبذل نفس الدرجة من العناية التي يبذلها المُفصح
                  لحماية سرية معلوماته السرية (ولكن ليس أقل من العناية المعقولة في أي حال من
                  الأحوال) بعدم الكشف عن أو استخدام أي معلومات سرية لأي غرض خارج نطاق اتفاقية
                  العميل.
                </li>
                <li>
                  يتعين على متلقي المعلومات أن يبذل جهودًا معقولة تجاريًا للحد من الوصول إلى معلومات
                  المفصح السرية (حسب الحالة) للذين يحتاجون إلى مثل هذا الوصول لأغراض تتوافق مع
                  اتفاقية العميل والذين وقعوا اتفاقيات سرية مع المتلقي.
                </li>
                <li>
                  يجوز للمتلقي الكشف عن المعلومات السرية (أ) بالقدر الذي يقتضيه القانون أو الإجراءات
                  القانونية؛ (ب) لمستشاريه القانونيين أو الماليين، شريطة أن يكون هؤلاء المستشارون
                  ملزمين بواجب السرية الذي يشمل قيود الاستخدام والإفصاح؛ و(ج) حسبما تقتضيه اللوائح
                  والقوانين المعمول بها.
                </li>
                <li>
                  يجوز لكل طرف الإفصاح عن الشروط والأحكام الخاصة باتفاقية العميل على أساس سري
                  للمستثمرين الحاليين والمحتملين والمشترين والمقرضين ومستشاريهم القانونيين والماليين
                  فيما يتعلق بأنشطة العناية الواجبة (due diligence activities).
                </li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              الاستثناءات في المعلومات السرية:
            </Typography>
            <Typography variant="body1" paragraph>
              تستثني من اعتبارها معلومات سرية تلك المعلومات التي (أ) أصبحت معروفة أو معروفة بشكل عام
              للعامة دون الإخلال بأي التزام مستحق للمُفصح؛ (ب) كانت معروفة للمستلم قبل الإفصاح عنها
              من قبل المُفصح دون الإخلال بأي التزام مستحق للمُفصح؛ (ج) تم استلامها من طرف ثالث دون
              الإخلال بأي التزام مستحق للمُفصح؛ أو (د) تم تطويرها بشكل مستقل من قبل المستلم دون
              استخدام أو الوصول إلى المعلومات السرية.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.ownership}>
              حقوق الملكية:
            </Typography>
            <Typography variant="body1" paragraph>
              إن البرامج وعمليات سير العمل وواجهة المستخدم والتصميمات والمعرفة الفنية والتقنيات
              الأخرى التي تقدمها منصة Hakeemna.com كجزء من الخدمة، وجميع التحديثات والتحسينات، هي
              ملكية خاصة للمنصة والجهات المرخصة لها، وكل الحقوق والملكية والمصلحة، بما في ذلك جميع
              حقوق الملكية الفكرية المرتبطة بها، تظل مملوكة للمؤسسة المالكة لمنصة Hakeemna.com وهي
              مؤسسة غسان ابو نبعة لتطوير المشاريع وتكنولوجيا المعلومات (رقم وطني للمنشأة: 101026865)
              .
            </Typography>
            <Typography variant="body1" paragraph>
              تحتفظ منصة Hakeemna.com بجميع الحقوق ما لم يتم منحها صراحةً في اتفاقية العميل.
            </Typography>
            <Typography variant="body1" paragraph>
              يوجد معلومات في المنصة ليست خاضعة لملكيتها، إنما هي ملكية المؤسسة المزودة لتلك
              المعلومات، على سبيل المثال وليس الحصر: أسماء الأمراض، و أسماء الأدوية الطبية.
            </Typography>
            <Typography variant="body1" paragraph>
              خدمات التجميع والبيانات مجهولة الهوية (Aggregation Services and De-identified Data):
              <ul>
                <li>
                  قد تستخدم منصة Hakeemna.com معلومات صحية محمية لتزويد أحد العملاء بخدمات تجميع
                  البيانات وإنشاء بيانات مجهولة الهوية.
                </li>
                <li>
                  تمتلك منصة Hakeemna.com وحدها كل الحقوق والملكية في أي بيانات مجهولة الهوية أو
                  بيانات مجمعة مصدرها المنصة.
                </li>
                <li>
                  قد تستخدم منصة Hakeemna.com والشركات التابعة لها وتكشف، أثناء وبعد انتهاء اتفاقية
                  العميل، عن جميع المعلومات المجمعة والمجهولة الهوية والبيانات مجهولة الهوية لأغراض
                  تحسين الخدمة والدعم الفني وأغراض العمل الأخرى.
                </li>
              </ul>
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.limitation}>
              حدود المسؤولية
            </Typography>
            <Typography variant="body1" paragraph>
              لا يوجد أضرار غير مباشرة لن تكون منصة Hakeemna.com مسؤولة عن اي اضرار غير مباشرة مثل
              أرباح لم تحقق، أو تكلفة فقدان البيانات، أو توقف الأعمال، أو أي أضرار عرضية أو خاصة أو
              غير مباشرة أو تبعية، حتى إذا تم إخطار العميل بإمكانية حدوث مثل هذه الأضرار.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة للأضرار المباشرة، فإنه لن يتجاوز سقف / الحد إجمالي مسؤولية منصة Hakeemna.com
              عن جميع الأضرار الناشئة عن أو المتعلقة باتفاقية العميل (في العقد أو الضرر أو غير ذلك)
              المبلغ الفعلي الذي دفعه العميل خلال الأشهر الستة (6) التي تسبق مباشرة الحدث الذي أدى
              إلى المطالبة. ويقصد بالسقف او الحد من المسؤولية أن يُطبق بغض النظر عما إذا كانت
              الأحكام الأخرى لهذه الاتفاقية قد تم انتهاكها أو ثبت عدم فعاليتها أو إذا فشل أحد الحلول
              في تحقيق غرضه الأساسي.
            </Typography>
            <Typography variant="body1" paragraph>
              يجب تقديم أي مطالبة من قبل العميل ضد منصة Hakeemna.com خلال ستة 2 أشهر من الحدث الذي
              أدى إلى نشوء المطالبة، وإذا لم يتم تقديمها خلال هذه الفترة الزمنية، يتم التنازل عن هذه
              المطالبة صراحةً من قبل العميل.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.dataReturn}>
              المدة والإنهاء وإعادة البيانات
            </Typography>
            <Typography variant="body1" paragraph>
              مدة العقد ستستمر الخدمات المعمول بها طوال المدة المحددة في اتفاقية العميل المعمول بها
              (المدة الأولية). بعد تاريخ انتهاء المدة الأولية، سيتم تمديد اتفاقية العميل تلقائيًا
              لفترات متتالية إضافية مساوية لمدة المدة الأولية (مدة التجديد) ما لم يقدم أي من الطرفين
              إشعارًا بعدم التجديد وفقًا للقسم المعنون إشعار بعدم التجديد أدناه. يمكن الإشارة إلى
              المدة الأولية وأي مدة تجديد لاحقة بشكل جماعي باسم المدة.
            </Typography>
            <Typography variant="body1" paragraph>
              إشعار بعدم التجديد لغايات منع تجديد اتفاقية العميل، يجب على أي طرف تقديم إشعار كتابي
              بعدم التجديد ويجب استلام هذا الإشعار الكتابي قبل ستين (60) يومًا من انتهاء اتفاقية
              العميل السارية آنذاك. إذا قرر العميل عدم التجديد، فيجب عليه إرسال إشعار بعدم التجديد
              عن طريق الاتصال بمدير الحساب المعين مباشرةً أو عبر وسائل الاتصال الواردة في سياسة
              الدعم الخاصة منصة Hakeemna.com.
            </Typography>
            <Typography variant="body1" paragraph>
              أي إشعار يتم استلامه في مدة اقل من الستين (60) يومًا سيؤدي إلى التجديد التلقائي
              لاتفاقية العميل لفترة تجديد إضافية.
            </Typography>
            <Typography variant="body1" paragraph>
              تخفيض مستوى الاشتراك يجب على العملاء الذين لديهم وحدات (مثل:حجز المواعيد الالكترونيو/
              او المحاسبة) تقديم إشعار كتابي قبل ثلاثين (30) يومًا على الأقل من انتهاء الاشتراك. يجب
              إرسال الإشعار إلى مدير الحساب المعين مباشرةً أو عبر طرق الاتصال الواردة في سياسة دعم
              منصة Hakeemna.com.
            </Typography>
            <Typography variant="body1" paragraph>
              إنهاء الاتفاقية بسبب خرق جوهري يحق لأي طرف إنهاء اتفاقية العميل إذا ارتكب الطرف الآخر
              خرقًا جوهريًا لأي بند من بنود اتفاقية العميل ولم يعالج الخرق في غضون ثلاثين (30) يومًا
              من تاريخ استلام إشعار كتابي أو إلكتروني بالخرق.
            </Typography>
            <Typography variant="body1" paragraph>
              لا يوجد إنهاء مبكرللاتفاقية؛ لا توجد إمكانية استرداد الأموال في حالة عدم إنهاء الخدمة
              وفقًا للقسمين بعنوان إشعار بعدم التجديد وإنهاء الخدمة بسبب خرق جوهري، لا يمكن للعميل
              إلغاء اتفاقية العميل أثناء مدة سريان الاتفاقية.؛ كذلك فانه لا تقدم منصة Hakeemna.com
              أي استرداد للأموال إذا قرر العميل التوقف عن استخدام الخدمة قبل نهاية المدة.
            </Typography>
            <Typography variant="body1" paragraph>
              إرجاع البيانات نظرًا لأن العميل لديه حق الوصول إلى معلومات العميل أثناء مدة الطلب، فلا
              تتحمل منصة Hakeemna.com أي التزام بتزويد العميل بمعلومات العميل عند إنهاء اتفاقية
              العميل. وعلى الرغم مما سبق، تحتفظ منصة Hakeemna.comبمعلومات العميل لمدة ستين (60)
              يومًا من تاريخ هذا الإنهاء، ويجوز لـ منصة Hakeemna.com توفير إمكانية الوصول إلى هذه
              المعلومات للعميل بناءً على طلبه. إذا تم تعليق حساب العميل لأي سبب، فستوفر منصة
              Hakeemna.com إمكانية الوصول دون اتصال بالإنترنت إلى معلومات العميل عبر طرق الاتصال
              المفصلة في سياسة الدعم.
            </Typography>
            <Typography variant="body1" paragraph>
              إجراءات العميل عند إنهاء الخدمة عند إنهاء الخدمة، يتعين على العميل سداد أي رسوم غير
              مدفوعة إتلاف جميع الممتلكات الفكرية والبيانات ذو علاقة بمنصة Hakeemna.comالتي بحوزته.
              يؤكد العميل، بناءً على طلب منصة Hakeemna.com كتابيًا أو إلكترونيًا أنه امتثل لهذا
              المطلب.
            </Typography>
            <Typography variant="body1" paragraph>
              تعليق أو إنهاء الخدمة بسبب انتهاك القانون أو الاتفاقية يجوز لمنصة Hakeemna.com تعليق
              أو إنهاء الخدمة على الفور وإزالة معلومات العميل المعمول بها إذا اعتقدت أنه ربما يكون
              العميل قد انتهك أي قانون معمول به أو أي بند من بنود اتفاقية العميل. في هذه الحالة،
              يجوز لمنصة Hakeemna.com بذل جهود معقولة لمحاولة الاتصال بالعميل مسبقًا، ولكن ليس من
              المطلوب منها القيام بذلك.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.compensation}>
              التعويض
            </Typography>
            <Typography variant="body1" paragraph>
              تعويض الذي يتحمله العميل: إلى الحد الأقصى الذي يسمح به القانون، يجب على العميل تعويض
              منصة Hakeemna.com والدفاع عنها (حسب اختيارها) وحمايتها من الأذى (بما في ذلك مسؤوليها و
              مديريها وموظفيها ووكلائها) ضد جميع مطالبات أي طرف، ومن المطالبات والأضرار والتكاليف
              والعقوبات والغرامات والنفقات (بما في ذلك أتعاب وتكاليف المحاماة المعقولة) الناشئة عن
              أو المتعلقة بما يلي:
              <ul>
                <li>استخدام الخدمة من قبل العميل؛</li>
                <li>خرق العميل لأي شرط في اتفاقية العميل؛</li>
                <li>أي استخدام أو وصول أو توزيع غير مصرح به للخدمة من قبل العميل؛</li>
                <li>
                  انتهاك حقوق الخصوصية لأي فرد فيما يتعلق بالمعلومات المقدمة، أو المعلومات
                  الاحتيالية أو غير الصالحة أو المكررة أو غير الكاملة أو غير المصرح بها أو المضللة
                  المقدمة بموجب حساب العميل أو من قبل العميل.
                </li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              تعويض الذي تتحمله منصة Hakeemna.com: يجب على منصة Hakeemna.com تعويض العميل والدفاع
              عنه وحمايته من وضد الالتزامات التي يتكبدها العميل نتيجة لأي إجراء يتخذه أي طرف خارجي
              (بخلاف الشخص أو الكيان الذي يتحكم بشكل مباشر أو غير مباشر أو يخضع لسيطرة مشتركة مع
              العميل) ضد العميل في حال ادعى الطرف الخارجي أن استخدام العميب خدمات منصة Hakeemna.com
              وفقًا لاتفاقية العميل هذه ينتهك أو يسيء استخدام حقوق الملكية الفكرية في المملكة
              الاردنية الهاشمية الخاصة بالمنصة الطبية للطرف الخارجي.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.conflict}>
              حل النزاعات
            </Typography>
            <Typography variant="body1" paragraph>
              القانون المنظم للنزاعات: اتفاقية العميل و المنصة Hakeemna.com وأي نزاع بينهم تخضع
              لقانون المملكة الاردنية الهاشمية.
            </Typography>
            <Typography variant="body1" paragraph>
              الدعاوى الجماعية: لا يجوز لأي طرف أن يرفع دعاوى ضد الطرف الآخر إلا بصفته الفردية، وليس
              بصفته مدعيًا أو عضوًا في أي دعوى جماعية أو تمثيلية أو إجراء. لا يجوز للوسيط دمج أو ضم
              أكثر من دعوى لطرف واحد، ولا يجوز له بخلاف ذلك أن يرأس أي شكل من أشكال الإجراءات
              الموحدة أو الجماعية أو التمثيلية.
            </Typography>
            <Typography variant="h6" gutterBottom ref={sectionRefs.other_terms}>
              شروط أخرى
            </Typography>
            <Typography variant="body1" paragraph>
              تشمل بند الشروط الأخرى العميل المشترك اشتراك مدفوع والعميل المشترك اشتراك مجاني.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.notifications}>
              الموافقة على الإشعارات الإلكترونية والاتصالات والمعاملات
            </Typography>
            <Typography variant="body1" paragraph>
              باستخدام المنصة، يوافق العميل على إجراء الأعمال إلكترونيًا ويوافق على تلقي الإشعارات
              الإلكترونية والافصاحات وتوقيع المستندات إلكترونيًا.
            </Typography>
            <Typography variant="body1" paragraph>
              سيتم إرسال جميع الإشعارات والافصاحات للعميل بشكل إلكتروني.
            </Typography>
            <Typography variant="body1" paragraph>
              بالنسبة لإشعارات محددة (على سبيل المثال، الإشعارات المتعلقة بالإنهاء أو الانتهاكات
              المادية)، قد تقوم منصة Hakeemna.com بإرسال إشعارات ورقية إلى العنوان البريدي الذي قدمه
              العميل.
            </Typography>
            <Typography variant="body1" paragraph>
              يتحمل العميل وحده المسؤولية عن الاحتفاظ بعنوان بريد إلكتروني محدث داخل حسابه لأغراض
              الإشعار؛ ولا تتحمل منصة Hakeemna.com أي مسؤولية مرتبطة بفشل العميل في الاحتفاظ
              بمعلومات الاتصال الدقيقة داخل الخدمة أو فشلها في مراجعة أي رسائل بريد إلكتروني أو
              إشعارات داخل الخدمة.
            </Typography>
            <Typography variant="body1" paragraph>
              لا تتحمل منصة Hakeemna.com مسؤولية أي رسوم تتعلق بالرسائل النصية أو نقل البيانات.
            </Typography>
            <Typography variant="body1" paragraph>
              إذا قدم العميل رقم هاتف محمول ووافق على تلقي الاتصالات من منصة Hakeemna.com، فإن
              العميل يخول منصة Hakeemna.com على وجه التحديد إرسال رسائل نصية أو مكالمات إلى هذا
              الرقم.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.agreement}>
              الاتفاقية الكاملة
            </Typography>
            <Typography variant="body1" paragraph>
              تشكل اتفاقية العميل الاتفاقية الكاملة بين الطرفين وتحل محل جميع المفاوضات أو
              الاتفاقيات السابقة أو المتزامنة، سواء كانت شفهية أو مكتوبة، المتعلقة بهذا الموضوع.
            </Typography>
            <Typography variant="body1" paragraph>
              لا يعتمد العميل على أي إقرار يتعلق بهذا الموضوع، شفهيًا أو مكتوبًا، غير مدرج في
              اتفاقية العميل. لا يكون ملزمًا أي إقرار أو وعد غير مدرج في اتفاقية العميل.
            </Typography>
            <Typography variant="body1" paragraph>
              لا يكون أي تعديل أو تنازل عن أي شرط من شروط اتفاقية العميل ساريًا ما لم يتم التوقيع
              عليه من قبل الطرفين.
            </Typography>
            <Typography variant="body1" paragraph>
              على الرغم مما سبق، يجوز لمنصة Hakeemna.com تعديل أو استبدال اتفاقية العميل على النحو
              المفصل في الفقرة بعنوان التغييرات أدناه.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.changes}>
              التغيير
            </Typography>
            <Typography variant="body1" paragraph>
              مع مرور الزمن، قد تخضع شروط الخدمة للتغيير في المستقبل من قبل منصة Hakeemna.com وفقًا
              لتقديرها الخاص في أي وقت.
            </Typography>
            <Typography variant="body1" paragraph>
              عند إجراء تغييرات على شروط الخدمة هذه، ستقوم منصة Hakeemna.com بإتاحة نسخة جديدة من
              الشروط المعدلة على الخدمات وستقوم أيضًا بتحديث تاريخ آخر تحديث في أسفل شروط الخدمة.
            </Typography>
            <Typography variant="body1" paragraph>
              ستكون أي تغييرات على شروط الخدمة سارية المفعول فورًا للعملاء الجدد وستكون سارية
              المفعول للعملاء المستمرين في أقرب وقت من: (أ) ثلاثون (30) يومًا بعد نشر إشعار بهذه
              التغييرات على الخدمات للعملاء الحاليين؛ (ب) ثلاثون (30) يومًا بعد إرسال إشعار عبر
              البريد الإلكتروني بهذه التغييرات إليك.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.feedback}>
              الملاحظات
            </Typography>
            <Typography variant="body1" paragraph>
              إذا قدم العميل ملاحظات أو اقتراحات حول الخدمة، فيجوز لمنصة Hakeemna.com (والشركات التي
              تسمح لها باستخدام تقنيتها) استخدام هذه المعلومات دون التزام تجاه العميل.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.trial_features}>
              ميزات الإصدار التجريبي أو الاشتراك المجاني الكلي أو اشتراك مجاني لجزء من خدمات المنصة
            </Typography>
            <Typography variant="body1" paragraph>
              إذا تمت دعوة العميل للوصول إلى أي ميزات تجريبية أو إلى اشتراك مجاني (جزئي أو كلي)
              للخدمة أو قام العميل بالوصول إلى أي ميزات تجريبية للخدمة، فإن العميل يوافق على ما يلي:
            </Typography>
            <ul>
              <li>
                أن هذه الميزات أو الاشتراك المجاني (جزئي أو كلي) لم يتم توفيرها باتفاق تجاري بواسطة
                منصة Hakeemna.com.
              </li>
              <li>
                أن هذه الميزات والخدمات في الاشتراك المجاني (جزئي أو كلي) قد لا تعمل بشكل صحيح، أو
                قد لا تكون في شكلها النهائي، أو قد لا تعمل بكامل طاقتها.
              </li>
              <li>
                أن هذه الميزات أو الاشتراك المجاني (جزئي أو كلي) قد تحتوي على أخطاء أو عيوب في
                التصميم أو مشاكل أخرى.
              </li>
              <li>
                أنه قد لا يكون من الممكن جعل هذه الميزات أو الاشتراك المجاني (جزئي أو كلي) تعمل
                بكامل طاقتها؛ أن استخدامها قد يؤدي إلى نتائج غير متوقعة، أو تلف أو فقدان البيانات،
                أو أضرار أو خسائر غير متوقعة أخرى.
              </li>
              <li>أن هذه الميزات قد تتغير وقد لا تصبح متاحة بشكل عام.</li>
              <li>
                أن منصة Hakeemna.com ليست ملزمة بأي شكل من الأشكال بمواصلة توفير أو صيانة هذه
                الميزات لأي غرض من الأغراض عند تقديم الخدمة المستمرة.
              </li>
              <li>
                يتم توفير هذه الميزات التجريبية أو الاشتراك المجاني (جزئي أو كلي) كما هي مع جميع
                العيوب. يتحمل العميل جميع المخاطر الناشئة عن استخدام هذه الميزات أو الاشتراك المجاني
                (جزئي أو كلي)، بما في ذلك، على سبيل المثال لا الحصر، خطر تلف نظام الكمبيوتر الخاص
                بالعميل أو تلف أو فقدان البيانات.
              </li>
            </ul>

            <Typography variant="h6" gutterBottom ref={sectionRefs.no_assignment}>
              لا يجوز التنازل
            </Typography>
            <Typography variant="body1" paragraph>
              يحق لمنصة Hakeemna.com التنازل عن اتفاقية العميل (أو حقوقها و/أو التزاماتها) أو نقلها
              إلى أي طرف ثالث دون موافقة العميل.
            </Typography>
            <Typography variant="body1" paragraph>
              لا يجوز للعميل التنازل عن اتفاقية العميل أو نقلها إلى طرف ثالث دون موافقة كتابية مسبقة
              من منصة Hakeemna.com.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.enforceability}>
              قابلية تنفيذ الشروط
            </Typography>
            <Typography variant="body1" paragraph>
              إذا كان أي شرط من شروط اتفاقية العميل غير صالح أو غير قابل للتنفيذ، فإن الشروط الأخرى
              تظل سارية المفعول.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.continuity}>
              استمرارية الشروط
            </Typography>
            <Typography variant="body1" paragraph>
              تظل جميع الشروط سارية بعد إنهاء اتفاقية العميل في حال كانت سارية المفعول بطبيعتها حتى
              يتمكن أحد الطرفين من تأكيد حقوقه والحصول على الحماية التي توفرها اتفاقية العميل.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.client_name}>
              اسم العميل
            </Typography>
            <Typography variant="body1" paragraph>
              يجوز لمنصة Hakeemna.com استخدام اسم العميل وشعاره في قوائم العملاء والمواد الترويجية
              ذات الصلة التي تصف العميل بأنه عميل لمنصة Hakeemna.com. هذا الاستخدام يجب أن يكون
              وفقًا لإرشادات وسياسات العلامة التجارية الخاصة بالعميل.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.force_majeure}>
              القوة القاهرة
            </Typography>
            <Typography variant="body1" paragraph>
              باستثناء الالتزام بدفع المال، لن يكون أي طرف مسؤولاً عن أي فشل أو تأخير في الأداء
              بموجب اتفاقية العميل نتيجة أي سبب خارج عن سيطرته المعقولة، بما في ذلك أعمال الحرب، أو
              الكوارث الطبيعية، أو الزلازل، أو الفيضانات، أو الحظر، أو الشغب، أو التخريب، أو نقص
              العمالة أو النزاع، أو العمل الحكومي أو فشل الإنترنت.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.notifications}>
              الإشعارات
            </Typography>
            <Typography variant="body1" paragraph>
              - باستثناء ما هو منصوص عليه خلافًا لذلك في هذه الوثيقة، يجوز تسليم أي إشعار أو اتصال
              مطلوب أو مسموح به بموجب هذه الوثيقة باليد أو إيداعه لدى شركة توصيل سريعة أو إرساله
              بالبريد المسجل أو المعتمد، مع طلب إيصال الاستلام، ودفع رسوم البريد مسبقًا إلى العنوان
              الخاص بالطرف المعنى كما هو موضح كتابيًا من قبل أي من الطرفين إلى الطرف الآخر. عنوان
              منصة Hakeemna.com للإشعار هو: شارع وصفي التل، عمارة رقم 153 ، مكتب رقم 22 ، عمان -
              المملكة الأردنية الهاشمية، وعن طريق البريد الإلكتروني إلى: legal@hakeemna.com.
            </Typography>
            <Typography variant="body1" paragraph>
              2- يعتبر الإشعار قد تم تقديمه اعتبارًا من تاريخ تسليمه أو إرساله بالبريد، أيهما أقرب.
            </Typography>

            <Typography variant="h6" gutterBottom ref={sectionRefs.cookies}>
              سياسة cookies
            </Typography>
            <Typography variant="body1" paragraph>
              لا نستخدم أدوات كوكيز في الصفحة، نجمع البيانات التي تقوم أنت بتخزينها في النظام وذلك
              بعد أن تقوم بفتح حساب في المنصة.
            </Typography>
            <Typography variant="caption">تاريخ آخر تحديث 30/10/202—- 16/03/2025</Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
