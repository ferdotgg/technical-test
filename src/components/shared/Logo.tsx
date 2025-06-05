import { Package, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "compact";
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  showSparkle?: boolean;
  title?: string;
  subtitle?: string;
}

const sizeClasses = {
  sm: {
    container: "w-8 h-8",
    icon: "w-4 h-4",
    sparkle: "w-2 h-2",
    sparkleContainer: "w-3 h-3",
    sparkleIcon: "w-1.5 h-1.5",
    text: "text-lg",
    subtitle: "text-xs",
    spacing: "space-x-2",
  },
  md: {
    container: "w-10 h-10",
    icon: "w-6 h-6",
    sparkle: "w-4 h-4",
    sparkleContainer: "w-4 h-4",
    sparkleIcon: "w-2.5 h-2.5",
    text: "text-xl",
    subtitle: "text-xs",
    spacing: "space-x-3",
  },
  lg: {
    container: "w-16 h-16",
    icon: "w-8 h-8",
    sparkle: "w-6 h-6",
    sparkleContainer: "w-6 h-6",
    sparkleIcon: "w-3 h-3",
    text: "text-2xl",
    subtitle: "text-sm",
    spacing: "space-x-4",
  },
  xl: {
    container: "w-20 h-20",
    icon: "w-10 h-10",
    sparkle: "w-8 h-8",
    sparkleContainer: "w-8 h-8",
    sparkleIcon: "w-4 h-4",
    text: "text-3xl",
    subtitle: "text-sm",
    spacing: "space-x-4",
  },
};

export const Logo = ({
  size = "md",
  showText = false,
  variant = "default",
  className,
  textClassName,
  iconClassName,
  showSparkle = true,
  title = "Products Hub",
  subtitle = "Real-time Dashboard",
}: LogoProps) => {
  const sizeConfig = sizeClasses[size];

  const LogoIcon = () => (
    <div className="relative">
      <div
        className={cn(
          "bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg",
          sizeConfig.container,
          iconClassName
        )}
      >
        <Package className={cn("text-white", sizeConfig.icon)} />
      </div>
      {showSparkle && (
        <div
          className={cn(
            "absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center",
            sizeConfig.sparkleContainer
          )}
        >
          <Sparkles className={cn("text-white", sizeConfig.sparkleIcon)} />
        </div>
      )}
    </div>
  );

  if (!showText) {
    return (
      <div className={className}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center", sizeConfig.spacing, className)}>
        <LogoIcon />
        <div className={textClassName}>
          <h1
            className={cn(
              "font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent",
              sizeConfig.text
            )}
          >
            {title}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", sizeConfig.spacing, className)}>
      <LogoIcon />
      <div className={textClassName}>
        <h1
          className={cn(
            "font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent",
            sizeConfig.text
          )}
        >
          {title}
        </h1>
        <p className={cn("text-gray-500 font-medium", sizeConfig.subtitle)}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export const HeaderLogo = (props: Omit<LogoProps, "showText" | "variant">) => (
  <Logo {...props} showText={true} variant="compact" />
);

export const AuthLogo = (props: Omit<LogoProps, "showText" | "variant">) => (
  <Logo {...props} showText={true} size="xl" />
);

export const LoadingLogo = (props: Omit<LogoProps, "variant">) => (
  <Logo {...props} />
);
