interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header = ({
  title = "Kvällens film",
  subtitle = "Hitta rätt film för ikväll bland populära titlar",
}: HeaderProps) => {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
};
