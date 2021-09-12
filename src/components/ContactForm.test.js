import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';

test('sanity check, renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    // Arrange: componenet is renedered
    render(<ContactForm />);
    // Act: 
    const header = screen.queryByText("Contact Form");
    // Assert: 
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    // Arrange: componenet is renedered
    render(<ContactForm />);
    // Act: 
    // -find the first name input
    const firstNameInput = screen.getByLabelText(/first name*/i);
    expect(firstNameInput).toBeInTheDocument();
    userEvent.type(firstNameInput, "Bob");
    const firstNameError = screen.getByText(/Error: firstName must have at least 5 characters./i)
    // Assert: 
    expect(firstNameError).toBeInTheDocument();
});

it('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const button = screen.getByRole('button');
    userEvent.click(button);

    const Errors = await screen.findAllByTestId('error');
    expect(Errors.length).toBe(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(firstNameInput, "Bobby");
    userEvent.type(lastNameInput, "Fisher");

    const button = screen.getByRole('button');
    userEvent.click(button);

    const emailError = await screen.findByText(/Error: email must be a valid email address./i);

    expect(emailError).toBeInTheDocument();

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "poop");

    const emailError = await screen.findByText(/Error: email must be a valid email address./i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(firstNameInput, "Bobby");
    userEvent.type(emailInput, "Fisher@fisherbobs.com");

    const button = screen.getByRole('button');
    userEvent.click(button);

    const lastNameError = await screen.findByText(/Error: lastName is a required field./i);

    expect(lastNameError).toBeInTheDocument();

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />, <DisplayComponent />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(firstNameInput, "Bobby");
    userEvent.type(lastNameInput, "Fisher");
    userEvent.type(emailInput, "Fisher@fisherbobs.com");

    const button = screen.getByRole('button');
    userEvent.click(button);

    const firstnameDisplay = screen.getByTestId("firstnameDisplay");
    const lastnameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.queryByTestId("messageDisplay");

    expect(firstnameDisplay).toHaveTextContent(/First Name: Bobby/i);
    expect(lastnameDisplay).toHaveTextContent(/Last Name: Fisher/i);
    expect(emailDisplay).toHaveTextContent(/Email: Fisher@fisherbobs.com/i);
    expect(messageDisplay).toEqual(null);

    expect(messageDisplay).not.toBeInTheDocument();


});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />, <DisplayComponent />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(firstNameInput, "Bobby");
    userEvent.type(lastNameInput, "Fisher");
    userEvent.type(emailInput, "Fisher@fisherbobs.com");
    userEvent.type(messageInput, "Let's chess it up homes!");

    const button = screen.getByRole('button');
    userEvent.click(button);


    const firstnameDisplay = screen.getByTestId("firstnameDisplay");
    const lastnameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.getByTestId("messageDisplay");

    expect(firstnameDisplay).toHaveTextContent(/First Name: Bobby/i);
    expect(lastnameDisplay).toHaveTextContent(/Last Name: Fisher/i);
    expect(emailDisplay).toHaveTextContent(/Email: Fisher@fisherbobs.com/i);
    expect(messageDisplay).toHaveTextContent(/Message: Let's chess it up homes!/i);

});