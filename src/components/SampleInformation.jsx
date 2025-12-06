import { useParams } from "react-router";

export default function SampleInformation() {
    let params = useParams();
    console.log(params.sampleID);

    return (
        <div>
            SampleInformation
        </div>
    );
}