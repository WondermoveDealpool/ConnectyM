import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Platform} from 'react-native';
import Input from '../../utils/forms/input';
import validationRules from '../../utils/forms/validationRules';

class AuthForm extends Component {
  state = {
    type: '로그인',
    action: '로그인',
    actionMode: '회원가입', //Button Title String값
    hasErrors: false,
    form: {
      email: {
        value: '',
        type: 'textinput',
        rules: {
          isRequired: true,
          isEmail: true,
        },
        valid: false,
      },
      password: {
        value: '',
        type: 'textinput',
        rules: {
          isRequired: true,
          minLength: 6,
        },
        valid: false,
      },
      confirmPassword: {
        value: '',
        type: 'textinput',
        rules: {
          confirmPassword: 'password',
        },
        valid: false,
      },
    },
  };

  updateInput = (name, value) => {
    this.setState({
      hasErrors: false,
    });
    let formCopy = this.state.form;
    formCopy[name].value = value;

    //rules
    let rules = formCopy[name].rules;
    let valid = validationRules(value, rules, formCopy);
    formCopy[name].valid = valid;

    this.setState({
      form: formCopy,
    });

    // console.warn(this.state.form);
  };

  confirmPassword = () => {
    this.state.type != 'Login' ? (
      <Input
        value={this.state.form.confirmPassword.value}
        type={this.state.form.confirmPassword.type}
        secureTextEntry={true}
        placeholder="비밀번호 재입력"
        placeholderTextColor="#ddd"
        onChangeText={value => this.updateInput('confirmPassword', value)}
      />
    ) : null;
  };

  formHasErrors = () => {
    this.state.hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>에러 발생</Text>
      </View>
    ) : null;
  };

  changeForm = () => {
    const type = this.state.type;

    this.setState({
      type: type === '로그인' ? '등록' : '로그인',
      action: type === '로그인' ? '등록' : '로그인',
      actionMode: type === '로그인' ? '로그인 화면으로' : '회원가입',
    });
  };

  submitUser = () => {
    //Init
    let isFormValid = true;
    let submittedForm = {};
    const formCopy = this.state.form;

    for (let key in formCopy) {
      if (this.state.type === '로그인') {
        if (key !== 'confirmPassword') {
          isFormValid = isFormValid && formCopy[key].valid;
          submittedForm[key] = formCopy[key].valid;
        }
      } else {
        isFormValid = isFormValid && formCopy[key].valid;
        submittedForm[key] = formCopy[key].valid;
      }
    }
    if (isFormValid) {
      if (this.state.type === '로그인') {
        console.log('로그인 : ');
        for (let key in submittedForm) {
          console.log(submittedForm[key]);
        }
      } else {
        console.log('회원가입 : ');
        for (let key in submittedForm) {
          console.log(submittedForm[key]);
        }
      }
    } else {
      this.setState({
        hasErrors: true,
      });
    }
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        userGoogleInfo: userInfo,
        googleLoaded: true,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <View>
        <Input
          value={this.state.form.email.value}
          type={this.state.form.email.type}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          placeholder="이메일 주소"
          placeholderTextColor="#ddd"
          onChangeText={value => this.updateInput('email', value)}
        />
        <Input
          value={this.state.form.password.value}
          type={this.state.form.password.type}
          secureTextEntry={true}
          placeholder="비밀번호"
          placeholderTextColor="#ddd"
          onChangeText={value => this.updateInput('password', value)}
        />
        {this.confirmPassword()}
        {this.formHasErrors()}

        <View style={{marginTop: 40}}>
          <View style={styles.button}>
            <Button
              title={this.state.action}
              color="#48567f"
              onPress={this.submitUser}
            />
          </View>
        </View>

        <View style={{marginTop: 40}}>
          <View style={styles.button}>
            <Button title="뷰 전환" color="#48567f" onPress={this.changeForm} />
          </View>
        </View>

        <View style={{marginTop: 40}}>
          <View style={styles.button}>
            <Button
              title="go to HomeView"
              color="#48567f"
              onPress={() => this.props.goWithoutLogin()}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    fontSize: 17,
    padding: 5,
    marginTop: 30,
  },
  errorContainer: {
    marginBottom: 10,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ee3344',
  },
  errorLabel: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  button: {
    ...Platform.select({
      ios: {
        marginTop: 15,
      },
      android: {
        marginTop: 15,
        marginBottom: 10,
      },
    }),
  },
});

export default AuthForm;
