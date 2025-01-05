import {
  Button,
  Heading,
  HStack,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/authProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Field } from "../../../components/ui/field";

interface FormValues {
  username: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const nextPage = location.state.from || "/";

  const onSubmit = handleSubmit((data) => {
    login(data).then(() => navigate(nextPage));
  });

  const onClear = () => {
    clearErrors();
    reset();
  };

  return (
    <VStack>
      <Heading marginTop="50px" marginBottom="20px" size="4xl">
        Frik Frak Online
      </Heading>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Stack gap="4" align="center" maxW="sm">
          
          <Field
            label="Utilizador"
            invalid={!!errors.username}
            errorText={errors.username?.message}
          >
            <Input
              {...register("username", { required: "* Valor obrigatório" })}
            />
          </Field>
          <Field
            label="Passe"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <Input
              {...register("password", { required: "* Valor obrigatório" })}
            />
          </Field>
          <HStack>
            <Button type="button" onClick={onClear}>
              Limpar
            </Button>
            <Button type="submit">Entrar</Button>
          </HStack>
        </Stack>
      </form>
    </VStack>
  );
};

export default LoginPage;
