import { Responses403 } from '@consta/gpn-responses/Responses403';
import { Responses404 } from '@consta/gpn-responses/Responses404';
import { Responses500 } from '@consta/gpn-responses/Responses500';
import { Responses503 } from '@consta/gpn-responses/Responses503';
import { ResponsesConnectionError } from '@consta/gpn-responses/ResponsesConnectionError';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/Layout';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from 'shared/typesAndConsts/router';

const ReturnButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      label="Вернуться на главную"
      view="ghost"
      size="m"
      onClick={() => navigate(PATHS.MAIN_PAGE)}
    />
  );
};

export const RESPONSES_MAP = {
  '404': <Responses404 actions={<ReturnButton />} />,
  '403': <Responses403 actions={<ReturnButton />} />,
  '500': <Responses500 actions={<ReturnButton />} />,
  '503': <Responses503 actions={<ReturnButton />} />,
  undefined: <ResponsesConnectionError actions={<ReturnButton />} />,
};

export const ErrorPage = () => {
  const { id = 'undefined' } = useParams<{ id: string }>();

  return (
    <Layout className={cnMixSpace({ pT: '6xl' })}>
      {RESPONSES_MAP[id as keyof typeof RESPONSES_MAP] ||
        RESPONSES_MAP['undefined']}
    </Layout>
  );
};
