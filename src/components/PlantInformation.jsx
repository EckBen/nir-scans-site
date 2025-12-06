import { useParams } from "react-router";

export default function PlantInformation() {
    let params = useParams();
    console.log(params.plantID);
    
    return (
        <div>
            PlantInformation
        </div>
    );
}