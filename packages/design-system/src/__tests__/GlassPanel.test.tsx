import { render, screen } from '@testing-library/react';
import { GlassPanel } from '../GlassPanel';

describe('GlassPanel', () => {
  it('renders children', () => {
    render(<GlassPanel>Hello Panel</GlassPanel>);
    expect(screen.getByText('Hello Panel')).toBeInTheDocument();
  });

  it('applies glass styles via data attribute', () => {
    const { container } = render(<GlassPanel>content</GlassPanel>);
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveAttribute('data-prism', 'glass-panel');
  });

  it('forwards className', () => {
    const { container } = render(<GlassPanel className="extra">content</GlassPanel>);
    expect(container.firstChild).toHaveClass('extra');
  });

  it('accepts padding variant', () => {
    const { container } = render(<GlassPanel padding="lg">content</GlassPanel>);
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('renders as custom element', () => {
    const { container } = render(<GlassPanel as="section">content</GlassPanel>);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });
});
