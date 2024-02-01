// import { Helmet } from 'react-helmet-async';

// import CustomerTraining from 'src/sections/super-admin/customerTraining/home/homepage';
// import { useGetUnitservice } from 'src/api/tables';
// import { useParams } from 'src/routes/hooks';

// // ----------------------------------------------------------------------

// export default function CustomerTrainingPage() {
//   const params = useParams();
//   const { id } = params;
//   const { data } = useGetUnitservice(id);
//   const unitServiceName = data?.name_english || 'unit service';
//   return (
//     <>
//       <Helmet>
//         <title> {unitServiceName} Accounting</title>
//       </Helmet>

//       <CustomerTraining unitServiceData={data} />
//     </>
//   );
// }
import { Helmet } from 'react-helmet-async';

import ComingSoonView from 'src/sections/other/coming-soon/view';

// ----------------------------------------------------------------------

export default function ComingSoonPage() {
  return (
    <>
      <Helmet>
        <title> Coming Soon</title>
      </Helmet>

      <ComingSoonView />
    </>
  );
}
