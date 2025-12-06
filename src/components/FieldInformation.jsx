import { useParams } from "react-router";

export default function FieldInformation() {
    let params = useParams();
    console.log(params.fieldID);

    return (
        <div>
            FieldInformation
        </div>
    );
}