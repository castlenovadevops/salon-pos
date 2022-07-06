import PropTypes from 'prop-types';
// material
import { Button } from '@mui/material';

ButtonContent.propTypes = {
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error'
  ]),
  variant: PropTypes.oneOf(['contained', 'outlined', 'ghost']),
  size: PropTypes.oneOf(['small', 'large', 'medium']),
  onClick: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  component: PropTypes.object,
  to: PropTypes.string,
  startIcon: PropTypes.object,
  className:PropTypes.string,
  style:PropTypes.object
};

export default function ButtonContent({
  color,
  variant,
  size,
  onClick,
  label,
  disabled,
  component,
  to,
  startIcon,
  className,
  style
}) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      style={style}
      onClick={onClick}
      disabled={disabled}
      component={component}
      to={to}
      startIcon={startIcon}
      className={className}
    >
      {label}
    </Button>
  );
}
