import { useState } from "react";

import { useData } from "../contexts/dataContext";
import { useAuth } from "../contexts/authContext";

import CardWithTitle from './CardWithTitle';
import Button from './Button';
import AddScanner from './crudModals/AddScanner';
import RemoveScanner from './crudModals/RemoveScanner';
import ChangePassword from './auth/ChangePassword';

export default function Settings() {
    const { addScannerToUserAccount, removeScannerFromUserAccount } = useData();
    const { logout, changePassword } = useAuth();

    const [showHelp, setShowHelp] = useState(false);

    const toggleHelp = () => {
      setShowHelp(!showHelp);
    };

    return (
      <>
        <CardWithTitle title='Settings'>
          <div className='flex flex-col gap-3 mt-5 px-5'>
            <AddScanner handleNewScanner={addScannerToUserAccount} />
            <RemoveScanner handleRemoveScanner={removeScannerFromUserAccount} />
            <ChangePassword handleChangePassword={changePassword} />
            <Button onClick={logout} variant='small'>Log Out</Button>
            <Button onClick={toggleHelp} variant='small'>Need Help?</Button>
          </div>
        </CardWithTitle>

        {showHelp &&
          <CardWithTitle title='Help'>
            <p>For technical help with issues regarding the operation and usage of the website please email <a href="mailto:someone@example.com">someone@example.com</a>.</p>
          </CardWithTitle>
        }
      </>
    );
}