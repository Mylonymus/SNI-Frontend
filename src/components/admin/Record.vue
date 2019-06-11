<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="600px" content-class="dlgNewEditItem">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" @click="e1 = 1" step="1">Step 1</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" @click="e1 = 2" step="2">Step 2</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step  :complete="e1 > 3" @click="e1 = 3" step="3">Step 3</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step  :complete="e1 > 4" @click="e1 = 4" step="4">Step 4</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5" @click="e1 = 5">Step 5</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card>
            <v-card-title class="text-xs-center">
              <v-flex xs12 md6>
              <HeadingSection :title="title" icon="notes"/>
              </v-flex>
              <v-flex xs12 md6>
                <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedItem.date"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          id="date"
                          name="date"
                          v-model="editedItem.date"
                          :label="$t('movement.DATE')"
                          :data-vv-as="$t('movement.DATE')"
                          :error="errors.has('date')"
                          :error-messages="errors.collect('date')"
                          v-validate.disable="'required:date'"
                          autocomplete="off"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="editedItem.date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(editedItem.date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
              </v-flex>
              <v-flex xs12 md6 offset-md3>
                <v-select
                      prepend-icon="merge_type"
                      :items="typeRecord"
                      v-model="editedItem.typeRecord"
                      name="typeRecord"
                      :label="$t('record.TYPE_RECORD')"
                      :data-vv-as="$t('record.TYPE_RECORD')"
                    ></v-select>
              </v-flex>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="date_range"
                      id="age"
                      name="age"
                      v-model="editedItem.age"
                      :label="$t('movement.age')"
                      :data-vv-as="$t('movement.age')"
                      :error="errors.has('age')"
                      :error-messages="errors.collect('age')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>  

                    <v-text-field
                      prepend-icon="blur_linear"
                      id="initialTA"
                      name="initialTA"
                      v-model="editedItem.initialTA"
                      :label="$t('movement.initialTA')"
                      :data-vv-as="$t('movement.initialTA')"
                      :error="errors.has('initialTA')"
                      :error-messages="errors.collect('initialTA')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>

                    <v-text-field
                      prepend-icon="blur_linear"
                      id="finalTA"
                      name="finalTA"
                      v-model="editedItem.finalTA"
                      :label="$t('movement.finalTA')"
                      :data-vv-as="$t('movement.finalTA')"
                      :error="errors.has('finalTA')"
                      :error-messages="errors.collect('finalTA')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field> 
            
                    
                  </v-flex>
                  
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="weightDry"
                      name="weightDry"
                      v-model="editedItem.weightDry"
                      :label="$t('movement.weightDry')"
                      :data-vv-as="$t('movement.weightDry')"
                      :error="errors.has('weightDry')"
                      :error-messages="errors.collect('weightDry')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>

                    <v-text-field
                      prepend-icon="healing"
                      id="weightPreHd"
                      name="weightPreHd"
                      v-model="editedItem.weightPreHd"
                      :label="$t('movement.weightPreHd')"
                      :data-vv-as="$t('movement.weightPreHd')"
                      :error="errors.has('weightPreHd')"
                      :error-messages="errors.collect('weightPreHd')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>

                    <v-text-field
                      prepend-icon="healing"
                      id="weightPostHd"
                      name="weightPostHd"
                      v-model="editedItem.weightPostHd"
                      :label="$t('movement.weightPostHd')"
                      :data-vv-as="$t('movement.weightPostHd')"
                      :error="errors.has('weightPostHd')"
                      :error-messages="errors.collect('weightPostHd')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 offset-md3>
                    <v-select
                      prepend-icon="merge_type"
                      :items="typeFilter"
                      v-model="editedItem.filter"
                      name="filter"
                      :label="$t('record.TYPE_FILTER')"
                      :data-vv-as="$t('record.TYPE_FILTER')"
                    ></v-select>
                    
                  </v-flex>
                  <v-flex xs12 md6> 
                    <v-time-picker v-model="editedItem.time" id="time" name="time" :landscape="true"></v-time-picker>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            
          </v-card>

          <v-btn color="primary" @click="e1 = 2">Continue</v-btn>

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card >

            <v-card-title class="text-xs-center">
              <v-flex xs12 md6>
                <HeadingSection :title="title" icon="notes"/>
              </v-flex> 
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="qs"
                      name="qs"
                      v-model="editedItem.qs"
                      :label="$t('movement.qs')"
                      :data-vv-as="$t('movement.qs')"
                      :error="errors.has('qs')"
                      :error-messages="errors.collect('qs')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="qd"
                      name="qd"
                      v-model="editedItem.qd"
                      :label="$t('movement.qd')"
                      :data-vv-as="$t('movement.qd')"
                      :error="errors.has('weightDry')"
                      :error-messages="errors.collect('qd')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="heparina"
                      name="heparina"
                      v-model="editedItem.heparina"
                      :label="$t('movement.heparina')"
                      :data-vv-as="$t('movement.heparina')"
                      :error="errors.has('heparina')"
                      :error-messages="errors.collect('heparina')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="ufml"
                      name="ufml"
                      v-model="editedItem.ufml"
                      :label="$t('movement.ufml')"
                      :data-vv-as="$t('movement.ufml')"
                      :error="errors.has('ufml')"
                      :error-messages="errors.collect('ufml')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="profileUf"
                      name="profileUf"
                      v-model="editedItem.profileUf"
                      :label="$t('movement.profileUf')"
                      :data-vv-as="$t('movement.profileUf')"
                      :error="errors.has('profileUf')"
                      :error-messages="errors.collect('profileUf')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="svsMeQL"
                      name="svsMeQL"
                      v-model="editedItem.svsMeQL"
                      :label="$t('movement.svsMeQL')"
                      :data-vv-as="$t('movement.svsMeQL')"
                      :error="errors.has('svsMeQL')"
                      :error-messages="errors.collect('svsMeQL')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="profileSVS"
                      name="profileSVS"
                      v-model="editedItem.profileSVS"
                      :label="$t('movement.profileSVS')"
                      :data-vv-as="$t('movement.profileSVS')"
                      :error="errors.has('profileSVS')"
                      :error-messages="errors.collect('profileSVS')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="kmeql"
                      name="kmeql"
                      v-model="editedItem.kmeql"
                      :label="$t('movement.kmeql')"
                      :data-vv-as="$t('movement.kmeql')"
                      :error="errors.has('kmeql')"
                      :error-messages="errors.collect('kmeql')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="epo"
                      name="epo"
                      v-model="editedItem.epo"
                      :label="$t('movement.epo')"
                      :data-vv-as="$t('movement.epo')"
                      :error="errors.has('epo')"
                      :error-messages="errors.collect('epo')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="hierro"
                      name="hierro"
                      v-model="editedItem.hierro"
                      :label="$t('movement.hierro')"
                      :data-vv-as="$t('movement.hierro')"
                      :error="errors.has('hierro')"
                      :error-messages="errors.collect('hierro')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex> 
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="e1 = 3">Continue</v-btn>

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card > 
            <v-card-title class="text-xs-center">
              <v-flex xs12 md6>
                <HeadingSection :title="title" icon="notes"/>
              </v-flex> 
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="complico"
                      name="complico"
                      v-model="editedItem.complico"
                      :label="$t('movement.complico')"
                      :data-vv-as="$t('movement.complico')"
                      :error="errors.has('svsMeQL')"
                      :error-messages="errors.collect('complico')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="medidas"
                      name="medidas"
                      v-model="editedItem.medidas"
                      :label="$t('movement.medidas')"
                      :data-vv-as="$t('movement.medidas')"
                      :error="errors.has('medidas')"
                      :error-messages="errors.collect('medidas')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="acceVasc"
                      name="acceVasc"
                      v-model="editedItem.acceVasc"
                      :label="$t('movement.acceVasc')"
                      :data-vv-as="$t('movement.acceVasc')"
                      :error="errors.has('acceVasc')"
                      :error-messages="errors.collect('acceVasc')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="hb"
                      name="hb"
                      v-model="editedItem.hb"
                      :label="$t('movement.hb')"
                      :data-vv-as="$t('movement.hb')"
                      :error="errors.has('hb')"
                      :error-messages="errors.collect('hb')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="hto"
                      name="hto"
                      v-model="editedItem.hto"
                      :label="$t('movement.hto')"
                      :data-vv-as="$t('movement.hto')"
                      :error="errors.has('hto')"
                      :error-messages="errors.collect('hto')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="cmhb"
                      name="cmhb"
                      v-model="editedItem.cmhb"
                      :label="$t('movement.cmhb')"
                      :data-vv-as="$t('movement.cmhb')"
                      :error="errors.has('cmhb')"
                      :error-messages="errors.collect('cmhb')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="vgm"
                      name="vgm"
                      v-model="editedItem.vgm"
                      :label="$t('movement.vgm')"
                      :data-vv-as="$t('movement.vgm')"
                      :error="errors.has('vgm')"
                      :error-messages="errors.collect('vgm')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="ferritina"
                      name="ferritina"
                      v-model="editedItem.ferritina"
                      :label="$t('movement.ferritina')"
                      :data-vv-as="$t('movement.ferritina')"
                      :error="errors.has('ferritina')"
                      :error-messages="errors.collect('ferritina')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="satTR"
                      name="satTR"
                      v-model="editedItem.satTR"
                      :label="$t('movement.satTR')"
                      :data-vv-as="$t('movement.satTR')"
                      :error="errors.has('satTR')"
                      :error-messages="errors.collect('satTR')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="leucos"
                      name="leucos"
                      v-model="editedItem.leucos"
                      :label="$t('movement.leucos')"
                      :data-vv-as="$t('movement.leucos')"
                      :error="errors.has('leucos')"
                      :error-messages="errors.collect('leucos')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="e1 = 4">Continue</v-btn>

          <v-btn flat>Cancel</v-btn>

          
        </v-stepper-content>
        
        <v-stepper-content step="4">
          <v-card > 
            <v-card-title class="text-xs-center">
              <v-flex xs12 md6>
                <HeadingSection :title="title" icon="notes"/>
              </v-flex> 
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="plaque"
                      name="plaque"
                      v-model="editedItem.plaque"
                      :label="$t('movement.plaque')"
                      :data-vv-as="$t('movement.plaque')"
                      :error="errors.has('plaque')"
                      :error-messages="errors.collect('plaque')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="glucosa"
                      name="glucosa"
                      v-model="editedItem.glucosa"
                      :label="$t('movement.glucosa')"
                      :data-vv-as="$t('movement.glucosa')"
                      :error="errors.has('glucosa')"
                      :error-messages="errors.collect('glucosa')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="urea"
                      name="urea"
                      v-model="editedItem.urea"
                      :label="$t('movement.urea')"
                      :data-vv-as="$t('movement.urea')"
                      :error="errors.has('urea')"
                      :error-messages="errors.collect('urea')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="cr"
                      name="cr"
                      v-model="editedItem.cr"
                      :label="$t('movement.cr')"
                      :data-vv-as="$t('movement.cr')"
                      :error="errors.has('cr')"
                      :error-messages="errors.collect('cr')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="acUrico"
                      name="acUrico"
                      v-model="editedItem.acUrico"
                      :label="$t('movement.acUrico')"
                      :data-vv-as="$t('movement.acUrico')"
                      :error="errors.has('acUrico')"
                      :error-messages="errors.collect('acUrico')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="ca"
                      name="ca"
                      v-model="editedItem.ca"
                      :label="$t('movement.ca')"
                      :data-vv-as="$t('movement.ca')"
                      :error="errors.has('ca')"
                      :error-messages="errors.collect('ca')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="p"
                      name="p"
                      v-model="editedItem.p"
                      :label="$t('movement.p')"
                      :data-vv-as="$t('movement.p')"
                      :error="errors.has('p')"
                      :error-messages="errors.collect('p')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="fosfAlcalin"
                      name="fosfAlcalin"
                      v-model="editedItem.fosfAlcalin"
                      :label="$t('movement.fosfAlcalin')"
                      :data-vv-as="$t('movement.fosfAlcalin')"
                      :error="errors.has('fosfAlcalin')"
                      :error-messages="errors.collect('fosfAlcalin')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="pth"
                      name="pth"
                      v-model="editedItem.pth"
                      :label="$t('movement.pth')"
                      :data-vv-as="$t('movement.pth')"
                      :error="errors.has('pth')"
                      :error-messages="errors.collect('pth')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="colest"
                      name="colest"
                      v-model="editedItem.colest"
                      :label="$t('movement.colest')"
                      :data-vv-as="$t('movement.colest')"
                      :error="errors.has('colest')"
                      :error-messages="errors.collect('colest')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="e1 = 5">Continue</v-btn>

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="5">
          <v-card > 
            <v-card-title class="text-xs-center">
              <v-flex xs12 md6>
                <HeadingSection :title="title" icon="notes"/>
              </v-flex> 
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    
                    <v-text-field
                      prepend-icon="healing"
                      id="tgc"
                      name="tgc"
                      v-model="editedItem.tgc"
                      :label="$t('movement.tgc')"
                      :data-vv-as="$t('movement.tgc')"
                      :error="errors.has('tgc')"
                      :error-messages="errors.collect('tgc')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="protTotales"
                      name="protTotales"
                      v-model="editedItem.protTotales"
                      :label="$t('movement.protTotales')"
                      :data-vv-as="$t('movement.protTotales')"
                      :error="errors.has('protTotales')"
                      :error-messages="errors.collect('protTotales')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="albunin"
                      name="albunin"
                      v-model="editedItem.albunin"
                      :label="$t('movement.albunin')"
                      :data-vv-as="$t('movement.albunin')"
                      :error="errors.has('albunin')"
                      :error-messages="errors.collect('albunin')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="tp"
                      name="tp"
                      v-model="editedItem.tp"
                      :label="$t('movement.tp')"
                      :data-vv-as="$t('movement.tp')"
                      :error="errors.has('tp')"
                      :error-messages="errors.collect('tp')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="ast"
                      name="ast"
                      v-model="editedItem.ast"
                      :label="$t('movement.ast')"
                      :data-vv-as="$t('movement.ast')"
                      :error="errors.has('ast')"
                      :error-messages="errors.collect('ast')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="alt"
                      name="alt"
                      v-model="editedItem.alt"
                      :label="$t('movement.alt')"
                      :data-vv-as="$t('movement.alt')"
                      :error="errors.has('alt')"
                      :error-messages="errors.collect('alt')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>


                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="healing"
                      id="bi"
                      name="bi"
                      v-model="editedItem.bi"
                      :label="$t('movement.bi')"
                      :data-vv-as="$t('movement.bi')"
                      :error="errors.has('bi')"
                      :error-messages="errors.collect('bi')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="bd"
                      name="bd"
                      v-model="editedItem.bd"
                      :label="$t('movement.bd')"
                      :data-vv-as="$t('movement.bd')"
                      :error="errors.has('bd')"
                      :error-messages="errors.collect('bd')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="na"
                      name="na"
                      v-model="editedItem.na"
                      :label="$t('movement.na')"
                      :data-vv-as="$t('movement.na')"
                      :error="errors.has('na')"
                      :error-messages="errors.collect('na')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="k"
                      name="k"
                      v-model="editedItem.k"
                      :label="$t('movement.k')"
                      :data-vv-as="$t('movement.k')"
                      :error="errors.has('k')"
                      :error-messages="errors.collect('k')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="healing"
                      id="tpp"
                      name="tpp"
                      v-model="editedItem.tpp"
                      :label="$t('movement.tpp')"
                      :data-vv-as="$t('movement.tpp')"
                      :error="errors.has('tpp')"
                      :error-messages="errors.collect('tpp')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

          
          </v-card>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red lighten3" flat @click="close" class="btnCancel">
                {{
                $t('dataTable.CANCEL')
                }}
              </v-btn>
              <v-btn flat @click="saveItem" class="btnSave primary">
                {{
                $t('dataTable.SAVE')
                }}
              </v-btn>
            </v-card-actions>
        </v-stepper-content>

      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
import { getFormat } from '@/utils/utils.js'
import { mapActions } from 'vuex'
import HeadingSection from '@/components/common/HeadingSection.vue'

const toyyyymmdd = str => {
  const val = new Date(str)
  const yyyy = val.getFullYear().toString()
  const mm = (val.getMonth() + 1).toString() // getMonth() is zero-based
  const dd = val.getDate().toString()

  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  )
}

export default {
  components: {
    HeadingSection
  },
  data: () => ({
    typeRecord: ['Nefrología'],
    typeFilter: ['Filtro 1'],
    defaultItem: {},
    editedItem: {
      // acUrico: '',
      // acceVasc: '',
      // age: 0,
      // albunin: '',
      // alt: '',
      // ast: '',
      // bd: '',
      // bi: '',
      // ca: '',
      // cmhb: '',
      // colest: '',
      // complico: '',
      // cr: '',
      // createdAt: '',
      // date: '',
      // epo: '',
      // ferritina: '',
      // filter: '',
      // finalTA: 0,
      // fosfAlcalin: '',
      // glucosa: 0,
      // hb: '',
      // heparina: '',
      // hierro: '',
      // hto: '',
      // initialTA: 0,
      // k: '',
      // kmeql: '',
      // lastname: '',
      // leucos: '',
      // medidas: '',
      // na: '',
      // name: '',
      // p: '', 
      // plaque: 0,
      // profileSVS: '',
      // profileUf: '',
      // protTotales: '',
      // pth: '',
      // qd: 0,
      // qs: 0,
      // satTR: 0,
      // svsMeQL: '',
      // tgc: '',
      // tp: 0,
      // tpp: 0,
      // typeRecord: '',
      // ufml: 0,
      // updatedAt: '',
      // urea: 0,
      // vgm: 0,
      // weightDry: '',
      // weightPostHd: '',
      // weightPreHd: '' 
    },
    menu: false,
    e1: 0,
    picker: null
  }),
  props: ['value', 'item', 'save', 'user'],
  watch: {
    async item(newValue) {
      this.editedItem = newValue && Object.keys(newValue) ? newValue : {}
      if (this.editedItem.date) {
        this.editedItem.date = toyyyymmdd(this.editedItem.date)
      }
    }
  },
  computed: {
    title() {
      return this.editedItem.id
        ? this.$t('admin.EDIT_RECORD')
        : this.$t('admin.NEW_RECORD')
    }
  },
  methods: {
    ...mapActions(['editRecord', 'saveRecord']),
    close() {
      this.editedItem = {}
      this.$emit('input')
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    async saveItem() {
      try {
        const valid = await this.$validator.validateAll()
        if (valid) {
          debugger;
          this.save(this.editedItem)
          this.close()
          return
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log('err form', error)
        this.close()
        return
      }
    }
  }
}
</script>
