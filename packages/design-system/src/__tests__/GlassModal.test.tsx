import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassModal } from '../GlassModal';

describe('GlassModal', () => {
  it('renders nothing when closed', () => {
    render(
      <GlassModal open={false} onClose={() => {}}>
        Content
      </GlassModal>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(
      <GlassModal open={true} onClose={() => {}}>
        Content
      </GlassModal>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', async () => {
    const handler = vi.fn();
    render(
      <GlassModal open={true} onClose={handler}>
        Content
      </GlassModal>,
    );
    await userEvent.click(screen.getByTestId('modal-backdrop'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('renders title when provided', () => {
    render(
      <GlassModal open={true} onClose={() => {}} title="Settings">
        Body
      </GlassModal>,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
