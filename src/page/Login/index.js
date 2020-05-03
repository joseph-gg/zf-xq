import React, {Component} from 'react'
import {Flex, WingBlank, WhiteSpace, NavBar, Toast} from 'antd-mobile'
import {Link} from 'react-router-dom'
import styles from './index.module.css'
import {ZFW_USER} from "../../utils";
import {withFormik} from "formik";
import * as yup from 'yup';
import {login} from "../../utils/api/user";
import {setLocalData} from "../../utils";
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
class Login extends Component {
    render() {
      const {
        values,
          touched,
          errors,
          handleChange,
          handleBlur,
          handleSubmit
      } = this.props;
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavBar mode="light">
                    账号登录
                </NavBar>
                <WhiteSpace size="xl"/>

                {/* 登录表单 */}
                <WingBlank onSubmit={handleSubmit}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formItem}>
                            <input
                                className={styles.input}
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                placeholder="请输入账号"
                            />
                        </div>
                        {/* 长度为5到8位，只能出现数字、字母、下划线 */}
                        {errors.username && <div className={styles.error}>{errors.username}</div>}
                        <div className={styles.formItem}>
                            <input
                                className={styles.input}
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                placeholder="请输入密码"
                            />
                        </div>
                        {/* 长度为5到12位，只能出现数字、字母、下划线 */}
                        {errors.password && <div className={styles.error}>{errors.password}</div>}
                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type="submit">
                                登 录
                            </button>
                        </div>
                    </form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to="/registe">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

const NewLogin = withFormik({
    mapPropsToValues: () => ({username: '', password: ''}),
    // 校验
    validationSchema:yup.object().shape({
        username: yup.string().required('用户名必填！').matches(REG_UNAME,'长度为5到8位，只能出现数字、字母、下划线 '),
        password: yup.string().required('密码必填！').matches(REG_PWD,'长度为5到12位，只能出现数字、字母、下划线')
    }),
    handleSubmit: async (values,{props:{history}}) => {
        // 获取用户名和密码
        const {username,password} = values;
        // 调用接口，检验用户名和密码
        const {status, data, description} = await login({username,password});
        if (status === 200) {
          Toast.success(description,2);
          // 存储token
          setLocalData(ZFW_USER,data.token);
          // 跳转页面
          history.push('/home/profile')
        } else {
          Toast.fail(description,2)
        }
    }
})(Login)
export default NewLogin;
