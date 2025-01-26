import { useAuth } from "../../../hooks/authProvider";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Field } from "../../../components/ui/field";
import { PasswordInput } from "../../../components/ui/password-input";
import { Button } from "../../../components/ui/button";
import { Alert } from "../../../components/ui/alert";
import background from "../../../assets/background-02.webp";
import BackgroundImageContainer from "../../components/background-image-container";
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

interface FormValues {
  username: string;
  password: string;
  email: string;
}

const RegisterPage = () => {
  const { register: authRegister, user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const nextPage = searchParams.get("next") || "/";

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    authRegister(data)
      .then(() => navigate(nextPage))
      .catch(() => setErrorMessage("Não foi possível criar sua conta."))
      .finally(() => setLoading(false));
  });

  const onClear = () => {
    setErrorMessage("");
    clearErrors();
    reset();
  };

  return user && token ? (
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
              <Text>Criar conta</Text>
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
                  label="Email"
                  invalid={!!errors.email}
                  errorText={errors.email?.message}
                >
                  <Input
                    type="email"
                    width="300px"
                    {...register("email", {
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
                  Já tem uma conta?{" "}
                  <Link
                    variant="underline"
                    href={`/login?next=${nextPage}`}
                    colorPalette="teal"
                  >
                    Entre aqui.
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
    </BackgroundImageContainer>
  );
};

export default RegisterPage;
