const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback = '',
  className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }
  
  const initials = fallback || alt?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
  
  return (
    <div className={`
      relative inline-flex items-center justify-center rounded-full
      bg-gray-200 text-gray-600 font-medium overflow-hidden
      ${sizes[size]} ${className}
    `}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

export default Avatar