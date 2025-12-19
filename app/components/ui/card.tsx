import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type HeaderProps = React.HTMLAttributes<HTMLElement>;
type TitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;

const Card = React.forwardRef<HTMLDivElement, DivProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`border border-(--border-input) rounded-lg shadow-sm ${className}`} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLElement, HeaderProps>(({ className = "", ...props }, ref) => (
  <header ref={ref} className={`p-6 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className = "", children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className = "", ...props }, ref) => (
    <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, DivProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, DivProps>(({ className = "", ...props }, ref) => (
  <footer ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
