import { ProjDocs } from 'features/ProjDocs';
import { SupportButton } from 'features/SupportButton';
import { ToggleThemeButton } from 'features/ToggleTheme';
import { observer } from 'mobx-react-lite';
import { Logo } from 'shared/ui/Logo';
import { MainHeader } from 'shared/ui/MainHeader';

const Header = observer(() => {
  return (
    <MainHeader
      left={
          <Logo/>
      }
      right={
        <>
          <ProjDocs />
          <SupportButton/>
          <ToggleThemeButton/>
        </>
      }
    />
  );
});

export { Header };
