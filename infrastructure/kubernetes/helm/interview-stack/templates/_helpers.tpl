{{- define "interview-stack.name" -}}
interview-stack
{{- end }}

{{- define "interview-stack.fullname" -}}
{{ .Release.Name }}
{{- end }}

{{- define "interview-stack.labels" -}}
app.kubernetes.io/name: {{ include "interview-stack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "interview-stack.selectorLabels" -}}
app.kubernetes.io/name: {{ include "interview-stack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
