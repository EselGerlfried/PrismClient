import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassButton } from '../GlassButton';

describe('GlassButton', () => {
  it('renders label', () => {
    render(<GlassButton onClick={() => {}}>Click me</GlassButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handler = vi.fn();
    render(<GlassButton onClick={handler}>Go</GlassButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop passed', async () => {
    const handler = vi.fn();
    render(
      <GlassButton onClick={handler} disabled>
        Go
      </GlassButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(
      <GlassButton onClick={() => {}} loading>
        Save
      </GlassButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('applies accent variant styles', () => {
    const { container } = render(
      <GlassButton onClick={() => {}} variant="accent">
        Buy
      </GlassButton>,
    );
    expect(container.firstChild).toHaveAttribute('data-variant', 'accent');
  });
});
