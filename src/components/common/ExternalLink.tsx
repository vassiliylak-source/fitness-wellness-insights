import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  openInSameTab?: boolean;
}

const ExternalLink = ({ href, children, className = '', openInSameTab = false }: ExternalLinkProps) => {
  const linkProps = openInSameTab 
    ? {} 
    : { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <a href={href} className={className} {...linkProps}>
      {children}
    </a>
  );
};

export default ExternalLink;