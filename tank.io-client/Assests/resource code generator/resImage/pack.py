import os
import shutil

g_current_folder = os.path.dirname(__file__)
g_root_path = "../../../"
g_resource_output_folder = os.path.join(g_current_folder, g_root_path + 'src/') #for copy action
g_data_code_folder = os.path.join(g_current_folder, g_root_path + 'src/')
g_data_code_file = "resource.js"
g_resource_input_folder = os.path.join(g_current_folder, g_root_path + 'res')

g_list_ext = ['.png', '.jpg','.ttf','.json','.tmx','.tsx']
resource_temp = ""
g_list_data = []
g_list_data_path = []


class ResourceFormatData:
    def __init__(self):
        self.id = ""
        self.path = ""


def load_template():
    global resource_temp
    resource_temp = open('temp/Resource.temp').read()


def write_file_in_folder(file_name, folder_name, data):
    print "start write_file_in_folder file_name: " + file_name + " folder_name: " + folder_name
    file_path = os.path.join(folder_name, file_name)
    file_write = open(file_path, 'w')
    file_write.write(data)
    file_write.close()
    print "write_file_in_folder success"


def create_folder_if_not_exist(folder):
    if not os.path.exists(folder):
        os.makedirs(folder)
        print "create_folder_if_not_exist " + folder


def find_resources_from_folder(folder):
    if not os.path.isdir(folder):
        print "find_resources_from_folder return because of not is dir: " + folder
        return
    
    global g_list_data

    for folder_child in os.listdir(folder):
        file_path = os.path.join(folder, folder_child)
        if os.path.isfile(file_path):
            dsStore = ".DS_Store"
            # print "find " + dsStore + ": " + str(file_path.rfind(dsStore)) + " file_path: " + file_path
            if file_path.rfind(dsStore) >= 0 or file_path.rfind(dsStore.upper()) >= 0 or file_path.rfind(dsStore.lower()) >= 0:
                print "SKIP .DS_Store from file_path: " + file_path
                continue
            file_name, file_ext = os.path.splitext(file_path)
            if(file_ext == ''):
                print "SKIP file not exist file_ext from file_path: " + file_path
                continue
            if (file_ext not in g_list_ext): continue
            if(any(file_ext in ext for ext in g_list_ext)):
                relative_path_for_id = os.path.relpath(file_path, g_resource_input_folder)
                relative_path_for_id = os.path.splitext(relative_path_for_id)[0] #todo get file_name
                relative_path_for_id = relative_path_for_id.replace('\\', '_').replace('/', '_').replace(' ', '_')
                # print "find_resources_from_folder child relative_path_for_id: " + relative_path_for_id
                relative_path_for_path = os.path.relpath(file_path, g_root_path)
                relative_path_for_path = relative_path_for_path.replace('\\', '/')
                # print "find_resources_from_folder child relative_path_for_path: " + relative_path_for_path

                data = ResourceFormatData()
                if len(g_list_ext) > 1:
                    data.id = relative_path_for_id + "_" + file_ext[1:]
                else:
                    data.id = relative_path_for_id
                data.path = relative_path_for_path
                g_list_data.append(data)

            # else:
                # print "find_resources_from_folder file_ext is not permission: " + file_ext + " SKIP file_path: " + file_path               
        else:
            if os.path.isdir(file_path):
                find_resources_from_folder(file_path)


def copy_sound(folder_path, file_name):
    folder_path = folder_path[0: folder_path.rfind("\\")]
    sound_out_folder = os.path.join(g_resource_output_folder, folder_path).replace('/', '\\')
    create_folder_if_not_exist(sound_out_folder)
    shutil.copyfile(os.path.join(folder_path, file_name), os.path.join(sound_out_folder, file_name))


def write_resource_to_code():
    path_data = "\n\t"
    for data in g_list_data:
        path_data += data.id.upper()
        path_data += ': "'
        path_data += data.path
        path_data += '",'
        path_data += '\n\t'

    buf = resource_temp
    buf = buf.replace('@list_attribute@', path_data[:(len(path_data)-1)])
    # print buf
    create_folder_if_not_exist(g_data_code_folder)
    file_out = os.path.join(g_data_code_folder, g_data_code_file)
    file_write = open(file_out, 'w')
    file_write.write(buf)
    file_write.close()
    print "write_resource_to_code SUCCESSFULLY !!! ==> " + file_out

#------------Main-------------------

load_template()
find_resources_from_folder(g_resource_input_folder)
write_resource_to_code()
