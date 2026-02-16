import { useGetImagings } from "src/api/imaging";

export default function Radiology() {
const { imagingData } = useGetImagings();
    
  return <div>
    <h1>radiology</h1>
    {imagingData.map((imaging)=>(
        <div key={imaging._id}>{imaging.diagnostic_test}</div>
    ))}
    </div>;
}