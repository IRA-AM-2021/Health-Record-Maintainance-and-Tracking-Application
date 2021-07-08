import React from "react";

import {
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody
} from "reactstrap";

const Forms = () => {
  return (
    <>
      <Card>
        <CardBody>
          <form>
            <div className="form-row">
              <FormGroup className="col-md-6">
                <Label htmlFor="inputEmail4">Email</Label>
                <Input type="email"  id="inputEmail4" placeholder="Email"/>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label htmlFor="inputPassword4">Password</Label>
                <Input type="password"  id="inputPassword4" placeholder="Password" autoComplete="off"/>
              </FormGroup>
            </div>
            <FormGroup>
              <Label htmlFor="inputAddress">Address</Label>
              <Input type="text"  id="inputAddress" placeholder="1234 Main St"/>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="inputAddress2">Address 2</Label>
              <Input type="text"  id="inputAddress2" placeholder="Apartment, studio, or floor"/>
            </FormGroup>
            <div className="form-row">
              <FormGroup className="col-md-6">
                <Label htmlFor="inputCity">City</Label>
                <Input type="text"  id="inputCity"/>
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label htmlFor="inputState">State</Label>
                <Input type="select" name="select" id="inputState" >
                  <option>Choose...</option>
                  <option>...</option>
                </Input>
              </FormGroup>
              <FormGroup className="col-md-2">
                <Label htmlFor="inputZip">Zip</Label>
                <Input type="text"  id="inputZip"/>
              </FormGroup>
            </div>
            <FormGroup check>
              <Label className="form-check-label">
                  <Input className="form-check-input" type="checkbox" value=""/>
                  Check me out
                  <span className="form-check-sign">
                    <span className="check"></span>
                  </span>
              </Label>
            </FormGroup>
            <Button type="submit" color="primary">Sign in</Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default Forms;