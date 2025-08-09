interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ src, alt = '', size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      rounded-full 
      overflow-hidden 
      bg-gray-200
      flex 
      items-center 
      justify-center
      ${className}
    `}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Se a imagem falhar, mostra a primeira letra do alt text
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = alt.charAt(0).toUpperCase();
          }}
        />
      ) : (
        <span className="text-gray-600 text-lg font-semibold">{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
