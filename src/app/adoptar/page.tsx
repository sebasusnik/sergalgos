'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Container from '../components/container'
import { Input } from '../ui/components/input'
import { Textarea } from '../ui/components/textarea'
import { RadioGroup } from '../ui/components/radio-group'
import { Button } from '../ui/components/button'
import { FormField } from '../ui/components/form-field'
import { Modal } from '../ui/components/modal'
import { DropzoneUpload } from '../ui/components/image-uploader/dropzone-upload'

const adoptionSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido.'),
  dni: z.string().min(1, 'El DNI es requerido.'),
  address: z.string().min(1, 'El domicilio es requerido.'),
  neighborhood: z.string(),
  city: z.string().min(1, 'La ciudad es requerida.'),
  phone: z.string().min(1, 'El teléfono es requerido.'),
  email: z.string().min(1, 'El email es requerido.').email('El formato del email es inválido.'),
  socialMedia: z.string(),
  q1: z.string().min(1, 'Respuesta requerida.'),
  q2: z.string(),
  q3: z.string().min(1, 'Respuesta requerida.'),
  q4: z.string(),
  q5: z.string(),
  q6: z.string(),
  q7: z.string(),
  q8: z.string(),
  q9: z.string().min(1, 'Respuesta requerida.'),
  q10: z.string(),
  q11: z.string().min(1, 'Respuesta requerida.'),
  q12: z.string(),
  q13: z.string(),
  q14: z.string(),
  q15: z.string(),
  q16: z.string(),
  q17: z.string(),
  q18: z.string(),
  q19: z.string(),
  q20: z.string(),
  q21: z.string(),
  q22: z.string().min(1, 'Respuesta requerida.'),
  q23: z.string().min(1, 'Respuesta requerida.'),
  q24: z.string(),
  q25: z.string().min(1, 'Respuesta requerida.')
})

type AdoptionFormData = z.infer<typeof adoptionSchema>

export default function AdoptionPage(): React.ReactElement {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: {
      fullName: '',
      dni: '',
      address: '',
      neighborhood: '',
      city: '',
      phone: '',
      email: '',
      socialMedia: '',
      q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
      q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '',
      q20: '', q21: '', q22: '', q23: '', q24: '', q25: ''
    }
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [fileError, setFileError] = useState<string>('')

  const questions = {
    // Personal Info
    fullName: 'Nombres y Apellidos',
    dni: 'DNI',
    address: 'Domicilio',
    neighborhood: 'Barrio',
    city: 'Ciudad',
    phone: 'Teléfonos',
    email: 'E-Mail',
    socialMedia: 'Usuario en redes sociales (Facebook o Instagram)',
    // Questions
    q1: '1. ¿Cuántas personas viven en la casa?',
    q2: '2. ¿De qué edades?',
    q3: '3. ¿Están todos los miembros de la familia de acuerdo en adoptar?',
    q4: '4. ¿A qué se dedican los miembros de la familia o qué profesión ejercen?',
    q5: '5. ¿Tiene algún animal en casa? ¿Cuál? ¿Está castrado?',
    q6: '6. Si tienen perros, ¿de qué raza son y qué temperamento tienen?',
    q7: '7. ¿En qué parte de la casa vive el perro?',
    q8: '8. Si no tienen, ¿han tenido? Si es así, ¿qué pasó con ellos?',
    q9: '9. ¿Por qué quiere adoptar? ¿Cuál es su motivación?',
    q10: '10. ¿Vio algún rescatado en nuestra Web que lo haya decidido a adoptar?',
    q11: '11. ¿Dónde vivirá el animal? (casa, departamento)',
    q12: '12. En caso de tener jardín o patio, ¿están totalmente cerrados?',
    q13: '13. ¿Tienen la vivienda en propiedad o alquiler? En el último caso, ¿cuentan con la autorización del propietario?',
    q14: '14. ¿Han pensado qué pasaría con el perro si tuvieran que cambiar de domicilio?',
    q15: '15. En caso de enfermedad o algún imprevisto, ¿tienen quién se haga cargo del animal?',
    q16: '16. ¿Dónde dormirá el perro?',
    q17: '17. ¿Cuántas veces lo sacarán al día y quién se encargará de hacerlo?',
    q18: '18. ¿Cuánto tiempo pasará el animal solo en casa?',
    q19: '19. ¿Han pensado qué hacer con el animal en vacaciones?',
    q20: '20. ¿Ante qué situación o por qué motivo devolvería al perro?',
    q21: '21. Cuando salen a pasear, ¿sueltan su perro para que corra libremente? ¿En qué lugar?',
    q22: '22. La adopción es para toda la vida del perro, ¿son conscientes de la responsabilidad que esto significa? ¿Asumen esa responsabilidad?',
    q23: '23. Realizamos una entrevista previa a la adopción y seguimientos posteriores, ¿está dispuesto a recibir una visita nuestra?',
    q24: '24. Adjuntar fotos del lugar, patio y dónde vivirá.',
    q25: '25. El traslado tiene un costo de $20.000. ¿Podrá abonarlo?'
  }




  const onSubmit = async (data: AdoptionFormData) => {
    try {
      // Create FormData to send files
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        const value = data[key as keyof AdoptionFormData]
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value)
        }
      })
      
      // Add uploaded files
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`file_${index}`, file)
      })
      
      // Add file count
      formDataToSend.append('fileCount', uploadedFiles.length.toString())

      const response = await fetch('/api/adoptar', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        setShowSuccessModal(true)
      } else {
        alert('Error al enviar el formulario: ' + result.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="bg-background font-sans pb-20 md:pb-0">
      {showSuccessModal && (
        <Modal title="¡Formulario Enviado!" onClose={() => setShowSuccessModal(false)}>
          <p>¡Gracias por tu interés en adoptar!</p>
          <p className="mt-2">El formulario ha sido enviado correctamente a nuestro equipo.</p>
          <p className="mt-2 font-semibold">Nos pondremos en contacto contigo pronto para continuar con el proceso de adopción.</p>
          {uploadedFiles.length > 0 && (
            <p className="mt-2 text-sm text-green-600">✓ Las fotos han sido enviadas junto con el formulario.</p>
          )}
        </Modal>
      )}
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-semibold text-4xl text-text-heading mb-2">
              Formulario de Preadopción
            </h1>
            <p className="text-text-muted">
              Gracias por considerar darle un hogar a uno de nuestros rescatados.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="border border-border rounded-lg my-14 bg-neutral-50">
          <div className="space-y-4 max-w-2xl mx-auto py-8" >
            {/* Personal Info Section */}
            <div className="space-y-4 p-5 border border-gray-200 rounded-lg bg-white">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Datos Personales</h2>
              <FormField id="fullName" label={questions.fullName}>
                <Input {...register('fullName')} id="fullName" />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
              </FormField>
              <FormField id="dni" label={questions.dni}>
                <Input {...register('dni')} id="dni" />
                {errors.dni && <p className="text-red-500 text-xs">{errors.dni.message}</p>}
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField id="address" label={questions.address}>
                  <Input {...register('address')} id="address" />
                  {errors.address && <div className="min-h-[20px]">
                    <p className="text-red-500 text-xs pt-1">{errors.address.message}</p>
                  </div>}
                </FormField>
                <FormField id="neighborhood" label={questions.neighborhood}>
                  <Input {...register('neighborhood')} id="neighborhood" />
                  <div className="min-h-[20px]" />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField id="city" label={questions.city}>
                  <Input {...register('city')} id="city" />
                  {errors.city && <div className="min-h-[20px]">
                    <p className="text-red-500 text-xs pt-1">{errors.city.message}</p>
                  </div>}
                </FormField>
                <FormField id="phone" label={questions.phone}>
                  <Input {...register('phone')} id="phone" type="tel" />
                  {errors.phone && <div className="min-h-[20px]">
                    <p className="text-red-500 text-xs pt-1">{errors.phone.message}</p>
                  </div>}
                </FormField>
              </div>
              <FormField id="email" label={questions.email}>
                <Input {...register('email')} id="email" type="email" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </FormField>
              <FormField id="socialMedia" label={questions.socialMedia}>
                <Input {...register('socialMedia')} id="socialMedia" />
              </FormField>
            </div>

            {/* Questions Section */}
            <div className="space-y-4 p-5 border border-gray-200 rounded-lg bg-white">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Cuestionario</h2>
              
              <FormField id="q1" label={questions.q1}>
                <Input {...register('q1')} id="q1" type="number" />
                {errors.q1 && <p className="text-red-500 text-xs">{errors.q1.message}</p>}
              </FormField>

              <FormField id="q2" label={questions.q2}>
                <Textarea {...register('q2')} id="q2" />
              </FormField>

              <FormField id="q3" label={questions.q3}>
                <Controller
                  name="q3"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                      name={field.name}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      options={[{value: 'Sí', label: 'Sí'}, {value: 'No', label: 'No'}]} 
                    />
                  )}
                />
                {errors.q3 && <p className="text-red-500 text-xs">{errors.q3.message}</p>}
              </FormField>

              <FormField id="q4" label={questions.q4}>
                <Textarea {...register('q4')} id="q4" />
              </FormField>

              <FormField id="q5" label={questions.q5}>
                <Textarea {...register('q5')} id="q5" />
              </FormField>

              <FormField id="q6" label={questions.q6}>
                <Textarea {...register('q6')} id="q6" />
              </FormField>

              <FormField id="q7" label={questions.q7}>
                <Textarea {...register('q7')} id="q7" />
              </FormField>

              <FormField id="q8" label={questions.q8}>
                <Textarea {...register('q8')} id="q8" />
              </FormField>
              
              <FormField id="q9" label={questions.q9}>
                <Textarea {...register('q9')} id="q9" />
                {errors.q9 && <p className="text-red-500 text-xs">{errors.q9.message}</p>}
              </FormField>
              
              <FormField id="q10" label={questions.q10}>
                <Textarea {...register('q10')} id="q10" />
              </FormField>
              
              <FormField id="q11" label={questions.q11}>
                <Controller
                  name="q11"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                      name={field.name}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      options={[{value: 'Casa', label: 'Casa'}, {value: 'Departamento', label: 'Departamento'}]} 
                    />
                  )}
                />
                {errors.q11 && <p className="text-red-500 text-xs">{errors.q11.message}</p>}
              </FormField>

              <FormField id="q12" label={questions.q12}>
                <Controller
                  name="q12"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                      name={field.name}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      options={[{value: 'Sí', label: 'Sí'}, {value: 'No', label: 'No'}]} 
                    />
                  )}
                />
              </FormField>

              <FormField id="q13" label={questions.q13}>
                <Textarea {...register('q13')} id="q13" />
              </FormField>

              <FormField id="q14" label={questions.q14}>
                <Textarea {...register('q14')} id="q14" />
              </FormField>

              <FormField id="q15" label={questions.q15}>
                <Textarea {...register('q15')} id="q15" />
              </FormField>

              <FormField id="q16" label={questions.q16}>
                <Textarea {...register('q16')} id="q16" />
              </FormField>

              <FormField id="q17" label={questions.q17}>
                <Textarea {...register('q17')} id="q17" />
              </FormField>

              <FormField id="q18" label={questions.q18}>
                <Textarea {...register('q18')} id="q18" />
              </FormField>

              <FormField id="q19" label={questions.q19}>
                <Textarea {...register('q19')} id="q19" />
              </FormField>

              <FormField id="q20" label={questions.q20}>
                <Textarea {...register('q20')} id="q20" />
              </FormField>

              <FormField id="q21" label={questions.q21}>
                <Textarea {...register('q21')} id="q21" />
              </FormField>
              
              <FormField id="q22" label={questions.q22}>
                <Controller
                  name="q22"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                      name={field.name}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      options={[{value: 'Sí', label: 'Sí'}, {value: 'No', label: 'No'}]} 
                    />
                  )}
                />
                {errors.q22 && <p className="text-red-500 text-xs">{errors.q22.message}</p>}
              </FormField>

              <FormField id="q23" label={questions.q23}>
                <Controller
                  name="q23"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                      name={field.name}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      options={[{value: 'Sí', label: 'Sí'}, {value: 'No', label: 'No'}]} 
                    />
                  )}
                />
                {errors.q23 && <p className="text-red-500 text-xs">{errors.q23.message}</p>}
              </FormField>
              
              <FormField id="q24" label={questions.q24}>
                <Controller
                  name="q24"
                  control={control}
                  render={({ field }) => (
                    <DropzoneUpload
                      files={uploadedFiles}
                      onFilesChange={(files) => {
                        setUploadedFiles(files)
                        field.onChange(files.length > 0 ? 'Archivos adjuntos' : '')
                      }}
                      error={fileError}
                      onError={setFileError}
                      maxSize={5 * 1024 * 1024} // 5MB
                      maxFiles={10}
                    />
                  )}
                />
              </FormField>
              
              <FormField id="q25" label={questions.q25}>
                <Controller
                  name="q25"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                      name={field.name}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      options={[{value: 'Sí', label: 'Sí'}, {value: 'No', label: 'No'}]} 
                    />
                  )}
                />
                {errors.q25 && <p className="text-red-500 text-xs">{errors.q25.message}</p>}
              </FormField>
            </div>

            <div className="flex justify-end mb-3 md:mb-0">
              <Button type="submit" disabled={isSubmitting} className="min-w-24">
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  )
} 