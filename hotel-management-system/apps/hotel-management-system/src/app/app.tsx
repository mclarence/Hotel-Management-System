// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import NxWelcome from './nx-welcome';
import { User } from '@hotel-management-system/models';
export function App() {
  var user: User = {
    uuid: '1234',
    username: 'test1',
  }


  return (
    <div>
      {user.uuid}
    </div>
  );
}

export default App;
