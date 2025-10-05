import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders the application', () => {
  render(<App />);
  const LinkElement = screen.getByText(/Cash & Expense Manager/i);
  expect(LinkElement).toBeInTheDocument();
});