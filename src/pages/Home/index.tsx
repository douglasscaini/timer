import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { CyclesContext } from "../../context/CyclesContext";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HandPalm, Play } from "phosphor-react";
import { FormProvider } from "react-hook-form";

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data);

        reset();
    }

    const task = watch("task");
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>

                <Countdown />

                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
                        <HandPalm />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                        <Play />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    );
}
