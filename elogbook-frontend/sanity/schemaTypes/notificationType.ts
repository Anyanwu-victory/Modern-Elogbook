import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const notificationType = defineType({
    name: 'notification',
    title: 'Notification',
    type: 'document',
    icon: DocumentTextIcon,
    fields: [
        defineField({
            name: 'recipient',
            title: 'Recipient',
            type: 'reference',
            to: [{type: 'user'}],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'message',
            title: 'Message',
            type: 'text',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'isRead',
            title: 'Is Read',
            type: 'boolean',
            initialValue: false,
        }),
         defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: (new Date()).toISOString()
         }),
         defineField({
            name: 'type',
      title: 'Notification Type',
      type: 'string',
      options: {
        list: [
          'logApproval',
          'supervisorAssignment',
          'visitSchedule',
          'system'
        ]
      }
         }),
        
    ],
    preview: {
        select: {
        title: 'title',
        date: 'date'
        },
        prepare(selection) {
        const {title, date} = selection
        return {
            title,
            subtitle: `Date: ${new Date(date).toLocaleDateString()}`
        }
        }
    }
})