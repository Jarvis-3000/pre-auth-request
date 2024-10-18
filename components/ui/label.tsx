import * as React from 'react';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string; 
}

const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  className,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
