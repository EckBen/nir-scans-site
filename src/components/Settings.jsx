import { useData } from "../contexts/dataContext";
import { useAuth } from "../contexts/authContext";

import CardWithTitle from './CardWithTitle';
import Button from './Button';
import AddScanner from './AddScanner';
import RemoveScanner from './RemoveScanner';
import ChangePassword from './auth/ChangePassword';

export default function Settings() {
    const { addScannerToUserAccount, removeScannerFromUserAccount } = useData();
    const { logout, changePassword } = useAuth();

    return (    
      <CardWithTitle title='Settings'>
        <div>
          <AddScanner handleNewScanner={addScannerToUserAccount} />
          <RemoveScanner handleRemoveScanner={removeScannerFromUserAccount} />
          <ChangePassword handleChangePassword={changePassword} />
          <Button onClick={logout} variant='small'>Log Out</Button>
        </div>
      </CardWithTitle>
    );
}