import React from 'react'
import { useParams } from 'react-router-dom'
import ProjectForm from '../../components/ProjectForm'

export default function UpdateProject() {
  const { id } = useParams()

  return <ProjectForm projectId={id} />
}
