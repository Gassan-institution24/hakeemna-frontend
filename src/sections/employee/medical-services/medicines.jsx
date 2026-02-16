
import { useGetMedicines } from 'src/api';

export default function Medicines() {


  const { medicinesData } = useGetMedicines({
    select: 'trade_name concentration',
  });
  return (  
    <div>
      <h1>Medicines</h1>
      {medicinesData.map((medicine) => (
        <div key={medicine._id}>{medicine.trade_name}</div>
      ))}
    </div>
  );
}
