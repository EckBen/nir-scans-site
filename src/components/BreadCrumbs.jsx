import { useLocation, useNavigate } from 'react-router';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { MdNavigateNext } from "react-icons/md";

export default function CustomBreadCrumbs() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    function handleClick(event, href) {
        event.preventDefault();
        navigate(href);
    }
    
    const breadcrumbs = [
        <Link underline="hover" key="home" color="inherit" onClick={(e) => handleClick(e, '/')}>Home</Link>
    ];
    pathnames.forEach((p,i) => {
        const text = p.length > 10 ? `...${p.slice(-7)}` : p[0].toUpperCase() + p.slice(1);
        let breadcrumb;
        if (i < pathnames.length - 1) {
            breadcrumb = <Link underline="hover" key={String(i)} color="inherit" onClick={(e) => handleClick(e, "/" + pathnames.slice(0,i+1).join("/"))}>{text}</Link>;
        } else {
            breadcrumb = <Typography key={String(i)} sx={{ color: 'text.primary' }}>{text}</Typography>
        }
        breadcrumbs.push(breadcrumb);
    });
    
    return (
        <div className='bg-gray-300 p-2'>
            <Breadcrumbs
                separator={<MdNavigateNext fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
        </div>
    );
}