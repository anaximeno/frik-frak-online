import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/authProvider";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Field } from "../../../components/ui/field";
import { PasswordInput } from "../../../components/ui/password-input";
import { Button } from "../../../components/ui/button";
import { Alert } from "../../../components/ui/alert";
import {
  Heading,
  Input,
  Stack,
  VStack,
  Card,
  Text,
  HStack,
  Link,
} from "@chakra-ui/react";
import background from "../../../assets/background-02.webp";
import BackgroundImageContainer from "../../components/background-image-container";
import BreadcrumbBox from "../../components/breadcrump-box";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../../../components/ui/breadcrumb";

interface FormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const navigate = useNavigate();
  const { login, user, token } = useAuth();
  const [searchParams] = useSearchParams();

  const nextPage = searchParams.get("next") || "/";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    login(data)
      .then(() => navigate(nextPage))
      .catch(() => setErrorMessage("Nome de utilizador ou passe incorreto."))
      .finally(() => setLoading(false));
  });

  const onClear = () => {
    setErrorMessage("");
    clearErrors();
    reset();
  };

  return user && token ? (
    // Don't show the login page if logged.
    <Navigate to={nextPage} replace />
  ) : (
    <BackgroundImageContainer image={background}>
      <VStack>
        <VStack marginTop="50px" marginBottom="20px">
          <Heading size="7xl">Frik Frak Online</Heading>
        </VStack>
        <form onSubmit={onSubmit}>
          <Card.Root opacity={0.95}>
            <Card.Header>
              <Text>Entrar na sua conta</Text>
              {errorMessage && <Alert status="error" title={errorMessage} />}
            </Card.Header>
            <Card.Body>
              <Stack gap="4" align="center" maxW="sm">
                <Field
                  label="Utilizador"
                  invalid={!!errors.username}
                  errorText={errors.username?.message}
                >
                  <Input
                    width="300px"
                    {...register("username", {
                      required: "* Valor obrigatório",
                    })}
                  />
                </Field>
                <Field
                  label="Passe"
                  invalid={!!errors.password}
                  errorText={errors.password?.message}
                >
                  <PasswordInput
                    width="300px"
                    {...register("password", {
                      required: "* Valor obrigatório",
                    })}
                  />
                </Field>
              </Stack>
            </Card.Body>
            <Card.Footer justifyContent="center">
              <VStack>
                <Text marginBottom="15px">
                  É novo aqui?{" "}
                  <Link
                    variant="underline"
                    href={`/register?next=${nextPage}`}
                    colorPalette="teal"
                  >
                    Cadastre-se.
                  </Link>
                </Text>
                <HStack>
                  <Button variant="subtle" onClick={onClear} disabled={loading}>
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    variant="surface"
                    loading={loading}
                    disabled={loading}
                  >
                    Entrar
                  </Button>
                </HStack>
              </VStack>
            </Card.Footer>
          </Card.Root>
        </form>
      </VStack>
      <BreadcrumbBox>
        <BreadcrumbRoot>
          <BreadcrumbLink href="/#">Página Principal</BreadcrumbLink>
          <BreadcrumbCurrentLink>Entrar</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
      </BreadcrumbBox>
    </BackgroundImageContainer>
  );
};

export default LoginPage;
