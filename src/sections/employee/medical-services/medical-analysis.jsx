import { useGetMedicalAnalysis } from "src/api/medicalAnalysis";

export default function MedicalAnalysis() {
    const { medicalAnalysisData } = useGetMedicalAnalysis();
  
  return <div>
    <h1>Medical Analysis</h1>
    {medicalAnalysisData?.map((analysis)=>(
        <div key={analysis._id}>{analysis.name_english}</div>
    ))}
    </div>;
}
