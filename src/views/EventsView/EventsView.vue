<template>
  <div class="container">
    <EventsFilter class="q-mb-md" />
    <q-table
      :loading="loadingDepartment"
      title="Cписок Событий"
      :rows="store.state.events.eventsData"
      :columns="columns"
      :rows-per-page-options="[0, 2, 5]"
      row-key="name"
      ref="tableRef"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:body="row">
        <q-tr @click="watchEvent(row.row)" class="cursor-pointer">
          <template v-for="col in row.cols" :key="col.name">
            <td v-if="col.name === 'actions'" style="width: 20px">
              <q-btn-dropdown
                color="primary"
                dense
                dropdown-icon="fa-solid fa-ellipsis-vertical"
                no-icon-animation
                flat
                cover
                menu-self="top left"
                auto-close
                @click.stop
              >
                <q-list>
                  <q-item-section style="min-width: 250px">
                    <q-btn @click.stop="editHandler(row.row)">Редактировать</q-btn>
                    <!-- <q-btn @click.stop="moveToArchive(row.row)">В архив</q-btn> -->
                    <q-btn v-if="!row.row.fulfilled_date" @click.stop="accomplishHandler(row.row, true)">
                      Завершить с результатом
                    </q-btn>
                    <q-btn v-if="!row.row.fulfilled_date" @click.stop="accomplishHandler(row.row, false)">
                      Завершить без результата
                    </q-btn>
                    <q-btn v-if="!row.row.fulfilled_date" @click.stop="rescheduleHandler(row.row)">Запланировать</q-btn>
                    <q-btn @click.stop="deleteHandler(row.row.id)"> Удалить </q-btn>
                  </q-item-section>
                </q-list>
              </q-btn-dropdown>
            </td>
            <td v-else :style="getRowColor(row.row)">{{ col.value }}</td>
          </template>
        </q-tr>
      </template>
    </q-table>
    <div class="row">
      <div class="col-4">
        <q-btn class="q-mt-md" @click.stop="addHandler()">
          <q-icon class="text-primary q-mr-md" size="1.3em" name="fas fa-plus" /> Добавить Событие
        </q-btn>
      </div>

      <div class="col-8 colors">
        <div class="color"><span style="background-color: #90ee90"></span> Завершено</div>
        <div class="color"><span style="background-color: #ff6347"></span> Просрочено</div>
        <div class="color"><span style="background-color: #ffff00"></span> Ждёт выполнения сегодня</div>
        <div class="color"><span style="background-color: #add8e6"></span> Ждёт выполнения в течение недели</div>
      </div>
    </div>
    <EventsModal @sumbit="fetchAllEvents()" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import EventsFilter from "@/components/Events/EventsFilter";
import { useEvents } from "./composables/useEvents";
import useEventsInit from "./composables/useEventsInit";
import usePagination from "./composables/usePagination";
import { ref } from "vue";
import EventsModal from "./EventsModal.vue";
import moment from "moment";

const tableRef = ref(null);
const store = useStore();

const {
  editHandler,
  addHandler,
  deleteHandler,
  loadingDepartment,
  fetchAllEvents,
  watchEvent,
  accomplishHandler,
  rescheduleHandler,
  // moveToArchive,
} = useEvents();
const { columns } = useEventsInit(tableRef, loadingDepartment);
const { onRequest, pagination } = usePagination(store.dispatch.bind(this, "events/fetchAllEvents"), loadingDepartment);

function getRowColor(row) {
  const today = moment().startOf("day");
  const eventDate = moment(row.appointment_date, "YYYY-MM-DD");
  const inAWeek = moment().startOf("day").add(7, "d");

  let color = "#fff";

  if (row.fulfilled_date) {
    color = "#90ee90";
  } else if (eventDate.unix() < today.unix()) {
    color = "#ff6347";
  } else if (eventDate.unix() === today.unix()) {
    color = "#ffff00";
  } else if (eventDate.unix() < inAWeek.unix()) {
    color = "#add8e6";
  }
  return { backgroundColor: color };
}
</script>

<style scoped lang="scss">
.colors {
  display: flex;
  align-items: center;
}

.color {
  display: flex;
  align-items: center;
  margin-right: 20px;

  span {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin-right: 10px;
    flex-shrink: 0;
  }
}
</style>
