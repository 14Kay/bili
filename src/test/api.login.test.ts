/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-19 17:31:40
 * @LastEditTime: 2023-05-20 00:34:40
 * @LastEditors: 14K
 */
import { Login} from '../api/login';
import { Credential } from "./../types/credential"

test('login test', async () => {
    try {
      await Login.loginWithQRcode("terminal",(res: Credential)=>{
        expect(res instanceof Credential).toBe(true);
      });
    } catch (e) {
      expect(false).toBe(true);
    }
});