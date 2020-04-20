import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "../common/input";
import { register } from "../services/userService";
class RegisterForm extends Component {
  state = {
    account: { email: "", name: "", password: "" },
    errors: {},
  };
  schema = {
    email: Joi.string().required().email().label("Email"),
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().min(5).label("Password"),
  };
  validate = () => {
    const { error } = Joi.validate(this.state.account, this.schema, {
      abortEarly: false,
    });
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });
    if (errors) return;
    console.log("submitted");
    //
    try {
      const response = await register(this.state.account);
      console.log(response);
      localStorage.setItem("token", response.headers["auth-token"]);
      window.location = "/search";
    } catch (ex) {
      if (ex.response && ex.response === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account, errors });
  };
  render() {
    const { account, errors } = this.state;
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="email"
            value={account.email}
            label="Email"
            onChange={this.handleChange}
            error={errors.email}
          />
          <Input
            name="name"
            value={account.name}
            label="Name"
            onChange={this.handleChange}
            error={errors.name}
          />
          <Input
            name="password"
            value={account.password}
            label="Password"
            onChange={this.handleChange}
            error={errors.password}
          />
          <button disabled={this.validate()} className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
