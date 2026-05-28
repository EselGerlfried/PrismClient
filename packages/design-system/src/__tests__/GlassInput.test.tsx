import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassInput } from '../GlassInput';

describe('GlassInput', () => {
  it('renders with placeholder', () => {
    render(<GlassInput placeholder="Search mods" onChange={() => {}} value="" />);
    expect(screen.getByPlaceholderText('Search mods')).toBeInTheDocument();
  });

  it('calls onChange on type', async () => {
    const handler = vi.fn();
    render(<GlassInput placeholder="Enter" onChange={handler} value="" />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(handler).toHaveBeenCalled();
  });

  it('renders label when provided', () => {
    render(<GlassInput label="Username" onChange={() => {}} value="" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<GlassInput error="Required" onChange={() => {}} value="" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
