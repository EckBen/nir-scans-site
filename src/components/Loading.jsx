import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className='absolute top-0 left-0 h-full w-full z-10 flex flex-col gap-2 justify-center items-center bg-gray-50'>
      <CircularProgress />
      <p>Loading...</p>
    </div>
  );
}