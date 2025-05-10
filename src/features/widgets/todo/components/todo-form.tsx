import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from 'lucide-react'
import { FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { add } from '../use-todo'

const TodoSchema = z.object({
  text: z.string(),
})

const TodoForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const form = useForm({
    defaultValues: {
      text: '',
    },
    validators: {
      onChange: TodoSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      setIsPending(true)
      const { error } = await add(value.text)
      if (error) setError(error)
      setIsPending(false)
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="grid gap-3"
    >
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-end gap-2">
        <form.Field
          name="text"
          children={(field) => (
            <>
              <FormItem className="flex-1">
                <Input
                  name={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  type="text"
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                />
                {field.state.meta.errors.length ? (
                  <FormMessage>{field.state.meta.errors.join(',')}</FormMessage>
                ) : null}
              </FormItem>
            </>
          )}
        />

        <Button type="submit" disabled={!form.state.isValid || isPending}>
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Add'}
        </Button>
      </div>
    </form>
  )
}

export default TodoForm
