import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorDetail() {
  const error = useRouteError();
  return (
    <div>
      {isRouteErrorResponse(error)
        ? "La pagina no existe"
        : `Ha ocurrido un error ${(error as Error).message}`}
    </div>
  );
}

export default ErrorDetail;
